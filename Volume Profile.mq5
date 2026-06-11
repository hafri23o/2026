//+------------------------------------------------------------------+
//|                                   PriceMemoryVolumeProfile.mq5   |
//|                                  Copyright 2026, Algorithmic Pro |
//|                                             https://mql5.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2026, Algorithmic Pro"
#property link      "https://mql5.com"
#property version   "1.00"
#property indicator_chart_window
#property indicator_plots   0

#include <ChartObjects\ChartObjectsLines.mqh>
#include <Arrays\ArrayObj.mqh>

//--- Enums
enum E_VOL_METHOD {
   VOL_METHOD_TICK_DIR, // Up-tick / Down-tick classification
   VOL_METHOD_BODY_DIR  // Bar Body Direction Estimation
};

//--- Structures
struct PriceLevelProfile {
   double price;
   long   total_volume;
   long   buy_volume;
   long   sell_volume;
};

//--- Class for managing individual Zone Memories
class CZoneMemory : public CObject
{
public:
   double            zone_low;
   double            zone_high;
   datetime          last_visit_start;
   datetime          last_visit_end;
   long              total_volume;
   long              buy_volume;
   long              sell_volume;
   long              delta_volume;
   double            poc_price;
   double            vah_price;
   double            val_price;
   int               time_spent_seconds;
   
   // Dynamic array to store micro-level volume distribution inside this zone
   PriceLevelProfile profile_levels[];

   CZoneMemory() : zone_low(0), zone_high(0), last_visit_start(0), last_visit_end(0),
                   total_volume(0), buy_volume(0), sell_volume(0), delta_volume(0),
                   poc_price(0), vah_price(0), val_price(0), time_spent_seconds(0) {}
};

//--- Input Parameters
input group "--- Zone Logic ---"
input bool         InpAutoZone          = true;        // Auto zone sizing option
input double       InpZoneSizePips      = 20.0;        // Zone size in pips (if Auto=false)
input int          InpMaxStoredZones    = 200;         // Maximum stored zones in memory

input group "--- Volume Profile Calculation ---"
input E_VOL_METHOD InpVolMethod         = VOL_METHOD_TICK_DIR; // Volume classification method
input double       InpValueAreaPercent  = 70.0;        // Value Area Percentage (VAH/VAL)
input long         InpMinZoneVolume     = 100;         // Minimum zone volume filter

input group "--- Visualization & Graphics ---"
input color        InpColorBuy          = clrDarkGreen;  // Buy Volume Color
input color        InpColorSell         = clrCrimson;    // Sell Volume Color
input color        InpColorPOC          = clrOrange;     // POC Line Color
input color        InpColorVA           = clrAqua;       // VAH/VAL Border Lines Color
input int          InpProfileWidth      = 150;           // Max profile width in pixels
input int          InpTextFontSize      = 9;             // Dashboard font size

//--- Global Variables
CArrayObj          g_zone_memory_list; // Holds historical records of CZoneMemory objects
CZoneMemory*       g_current_zone = NULL;
double             g_zone_size = 0.0;
int                g_last_tracked_bar_index = -1;
datetime           g_current_visit_start = 0;

// Trackers for currently active/displayed zone data to update dashboard
double             g_display_zone_low = 0;
double             g_display_zone_high = 0;
CZoneMemory        g_active_display_data;
bool               g_has_historical_memory = false;

//--- Initialization
int OnInit()
{
   // Determine Zone Size
   if(InpAutoZone)
   {
      // Auto Calculation using ATR-like proxy or fixed baseline per asset type
      double ATR_proxy = iATR(_Symbol, _Period, 14, 0);
      if(ATR_proxy <= 0) ATR_proxy = _Point * 200; 
      g_zone_size = NormalizeDouble(ATR_proxy, _Digits);
   }
   else
   {
      // Convert Pips to Quote Price Difference
      double pip_unit = (_Digits == 3 || _Digits == 5) ? 0.0001 : 0.01;
      if(_Digits == 1 || _Digits == 2) pip_unit = 0.01;
      g_zone_size = InpZoneSizePips * pip_unit;
   }
   
   if(g_zone_size <= 0)
   {
      Print("Initialization Error: Invalid calculated Zone Size.");
      return(INIT_FAILED);
   }

   g_zone_memory_list.Clear();
   g_current_zone = NULL;
   g_last_tracked_bar_index = -1;
   g_current_visit_start = 0;
   g_has_historical_memory = false;

   return(INIT_SUCCEEDED);
}

//--- Deinitialization
void OnDeinit(const int reason)
{
   ObjectsDeleteAll(0, "PMP_");
   g_zone_memory_list.Clear();
}

//--- Core Execution Iteration
int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double &open[],
                const double &high[],
                const double &low[],
                const double &close[],
                const long &tick_volume[],
                const long &volume[],
                const int &spread[])
{
   if(rates_total < 2) return(0);

   // Establish index parsing direction (0 = oldest bar, rates_total - 1 = newest live bar)
   int start_idx = (prev_calculated == 0) ? 1 : prev_calculated - 1;

   for(int i = start_idx; i < rates_total; i++)
   {
      double current_mid_price = (high[i] + low[i]) / 2.0;
      double zone_floor = MathFloor(current_mid_price / g_zone_size) * g_zone_size;
      double zone_ceiling = zone_floor + g_zone_size;

      // Check if price crossed over into a different zone grid boundary
      if(g_current_zone == NULL || g_current_zone.zone_low != zone_floor)
      {
         // 1. Wrap up, finalize and store the old zone memory profile
         if(g_current_zone != NULL)
         {
            g_current_zone.last_visit_end = time[i-1];
            g_current_zone.time_spent_seconds = (int)(g_current_zone.last_visit_end - g_current_zone.last_visit_start);
            
            // Commit to list if it passes structural constraints
            if(g_current_zone.total_volume >= InpMinZoneVolume)
            {
               SaveZoneToMemoryList(g_current_zone);
            }
            else
            {
               delete g_current_zone;
            }
         }

         // 2. Scan historical records to see if this newly entered zone has an existing memory
         g_has_historical_memory = FindHistoricalZone(zone_floor, zone_ceiling, g_active_display_data);
         g_display_zone_low = zone_floor;
         g_display_zone_high = zone_ceiling;

         // 3. Spawn a fresh new instance to compile the current live visit profile metrics
         g_current_zone = new CZoneMemory();
         g_current_zone.zone_low = zone_floor;
         g_current_zone.zone_high = zone_ceiling;
         g_current_zone.last_visit_start = time[i];
         
         // Initialize internal micro levels array matching asset pricing resolution steps
         int total_steps = (int)MathRound((zone_ceiling - zone_floor) / _Point) + 1;
         ArrayResize(g_current_zone.profile_levels, total_steps);
         for(int k = 0; k < total_steps; k++)
         {
            g_current_zone.profile_levels[k].price = zone_floor + (k * _Point);
            g_current_zone.profile_levels[k].total_volume = 0;
            g_current_zone.profile_levels[k].buy_volume = 0;
            g_current_zone.profile_levels[k].sell_volume = 0;
         }
      }

      // Calculate and feed volume data from the current bar iteration into the active zone tracker
      ProcessBarVolumeData(g_current_zone, open[i], high[i], low[i], close[i], tick_volume[i]);
      g_last_tracked_bar_index = i;
   }

   // Always push the most up-to-date visual components onto the interface canvas
   RenderGraphics();

   return(rates_total);
}

//+------------------------------------------------------------------+
//| ProcessBarVolumeData                                             |
//+------------------------------------------------------------------+
void ProcessBarVolumeData(CZoneMemory* zone, double o, double h, double l, double c, long vol)
{
   if(zone == NULL || vol <= 0) return;

   long b_vol = 0; 
   long s_vol = 0;

   // Volume Decomposition Classification Engines
   if(InpVolMethod == VOL_METHOD_TICK_DIR)
   {
      // Algorithmic proxy modeling tick movements via directional closes
      if(c > o) {
         b_vol = (long)(vol * 0.6);
         s_vol = vol - b_vol;
      } else if (c < o) {
         s_vol = (long)(vol * 0.6);
         b_vol = vol - s_vol;
      } else {
         b_vol = vol / 2;
         s_vol = vol - b_vol;
      }
   }
   else // VOL_METHOD_BODY_DIR
   {
      double range = h - l;
      if(range > 0)
      {
         double buy_pressure = (c - l) / range;
         b_vol = (long)MathRound(vol * buy_pressure);
         s_vol = vol - b_vol;
      }
      else
      {
         b_vol = vol / 2;
         s_vol = vol - b_vol;
      }
   }

   zone.total_volume += vol;
   zone.buy_volume += b_vol;
   zone.sell_volume += s_vol;
   zone.delta_volume = zone.buy_volume - zone.sell_volume;

   // Map volume systematically to price levels overlapping this bar
   double scan_low = MathMax(l, zone.zone_low);
   double scan_high = MathMin(h, zone.zone_high);
   
   int steps_inside = (int)MathRound((scan_high - scan_low) / _Point) + 1;
   if(steps_inside <= 0) steps_inside = 1;
   
   long allocated_total_vol = vol / steps_inside;
   long allocated_buy_vol = b_vol / steps_inside;
   long allocated_sell_vol = s_vol / steps_inside;

   int total_array_elements = ArraySize(zone.profile_levels);
   for(int k = 0; k < total_array_elements; k++)
   {
      if(zone.profile_levels[k].price >= scan_low && zone.profile_levels[k].price <= scan_high)
      {
         zone.profile_levels[k].total_volume += allocated_total_vol;
         zone.profile_levels[k].buy_volume += allocated_buy_vol;
         zone.profile_levels[k].sell_volume += allocated_sell_vol;
      }
   }
}

//+------------------------------------------------------------------+
//| CompileValueAreaMetrics |
//+------------------------------------------------------------------+
void CompileValueAreaMetrics(CZoneMemory* zone)
{
if(zone == NULL) return;
int size = ArraySize(zone.profile_levels);
if(size <= 0) return;
long max_v = -1;
int poc_index = 0;
// Identify Point of Control (POC)
for(int i = 0; i < size; i++)
{
if(zone.profile_levels[i].total_volume > max_v)
{
max_v = zone.profile_levels[i].total_volume;
poc_index = i;
}
}
zone.poc_price = zone.profile_levels[poc_index].price;
// Mathematical expansion for Value Area High / Low (VAH/VAL) Boundaries
long target_va_volume = (long)(zone.total_volume * (InpValueAreaPercent / 100.0));
long current_va_volume = zone.profile_levels[poc_index].total_volume;
int upper_ptr = poc_index;
int lower_ptr = poc_index;
while(current_va_volume < target_va_volume)
{
long upper_vol = 0;
long lower_vol = 0;
if(upper_ptr + 1 < size) upper_vol = zone.profile_levels[upper_ptr + 1].total_volume;
if(lower_ptr - 1 >= 0) lower_vol = zone.profile_levels[lower_ptr - 1].total_volume;
if(upper_vol == 0 && lower_vol == 0) break;
if(upper_vol >= lower_vol)
{
upper_ptr++;
current_va_volume += upper_vol;
}
else
{
lower_ptr--;
current_va_volume += lower_vol;
}
}
zone.vah_price = zone.profile_levels[upper_ptr].price;
zone.val_price = zone.profile_levels[lower_ptr].price;
}
//+------------------------------------------------------------------+
//| SaveZoneToMemoryList |
//+------------------------------------------------------------------+
void SaveZoneToMemoryList(CZoneMemory* zone_to_save)
{
CompileValueAreaMetrics(zone_to_save);
// Scan for and purge older duplicate zone memories to capture the absolute newest state
for(int i = 0; i < g_zone_memory_list.Total(); i++)
{
CZoneMemory* historical = g_zone_memory_list.At(i);
if(historical.zone_low == zone_to_save.zone_low)
{
g_zone_memory_list.Delete(i);
break;
}
}
g_zone_memory_list.Add(zone_to_save);
// Keep list length optimized below resource limits
while(g_zone_memory_list.Total() > InpMaxStoredZones)
{
g_zone_memory_list.Delete(0);
}
}
//+------------------------------------------------------------------+
//| FindHistoricalZone |
//+------------------------------------------------------------------+
bool FindHistoricalZone(double floor, double ceiling, CZoneMemory &out_target)
{
for(int i = g_zone_memory_list.Total() - 1; i >= 0; i--)
{
CZoneMemory* historical = g_zone_memory_list.At(i);
if(historical.zone_low == floor)
{
// Map values directly to instance container
out_target.zone_low = historical.zone_low;
out_target.zone_high = historical.zone_high;
out_target.last_visit_start = historical.last_visit_start;
out_target.last_visit_end = historical.last_visit_end;
out_target.total_volume = historical.total_volume;
out_target.buy_volume = historical.buy_volume;
out_target.sell_volume = historical.sell_volume;
out_target.delta_volume = historical.delta_volume;
out_target.poc_price = historical.poc_price;
out_target.vah_price = historical.vah_price;
out_target.val_price = historical.val_price;
out_target.time_spent_seconds = historical.time_spent_seconds;
int step_len = ArraySize(historical.profile_levels);
ArrayResize(out_target.profile_levels, step_len);
for(int j = 0; j < step_len; j++) {
out_target.profile_levels[j] = historical.profile_levels[j];
}
return(true);
}
}
return(false);
}
//+------------------------------------------------------------------+
//| RenderGraphics |
//+------------------------------------------------------------------+
void RenderGraphics()
{
// Clear visual artifacts from older rendering sequences
ObjectsDeleteAll(0, "PMP_");
// Create high contrast UI panel container background
CreateDashboardPanel();
if(!g_has_historical_memory)
{
UpdateDashboardText("No memory found for current zone grid.");
return;
}
// 1. Draw structural price benchmark horizontal reference anchors
CreateHorizontalLine("PMP_POC_LN", g_active_display_data.poc_price, InpColorPOC, STYLE_SOLID, 2);
CreateHorizontalLine("PMP_VAH_LN", g_active_display_data.vah_price, InpColorVA, STYLE_DOT, 1);
CreateHorizontalLine("PMP_VAL_LN", g_active_display_data.val_price, InpColorVA, STYLE_DOT, 1);
// 2. Render dynamic volume profile distributions layout
int active_levels_count = ArraySize(g_active_display_data.profile_levels);
long max_level_vol = 1;
for(int k = 0; k < active_levels_count; k++)
{
if(g_active_display_data.profile_levels[k].total_volume > max_v_calc)
max_level_vol = g_active_display_data.profile_levels[k].total_volume;
}
int chart_bars_visible = (int)ChartGetInteger(0, CHART_VISIBLE_BARS);
int target_anchor_bar = (int)ChartGetInteger(0, CHART_FIRST_VISIBLE_BAR) - (chart_bars_visible / 8);
if(target_anchor_bar < 0) target_anchor_bar = 0;
datetime anchor_time = iTime(_Symbol, _Period, target_anchor_bar);
// Plot histogram blocks
for(int m = 0; m < active_levels_count; m += 2) // Step 2 to save processing and object count overhead
{
long total_lv = g_active_display_data.profile_levels[m].total_volume;
if(total_lv <= 0) continue;
double percentage_width = (double)total_lv / (double)max_level_vol;
int bars_offset = (int)(percentage_width * 12); // Length proportional to visible bars scaling
if(bars_offset <= 0) bars_offset = 1;
int start_bar = target_anchor_bar;
int end_bar = target_anchor_bar + bars_offset;
datetime start_t = iTime(_Symbol, _Period, start_bar);
datetime end_t = iTime(_Symbol, _Period, MathMin(end_bar, rates_total_mock_check()));
string obj_name_b = "PMP_HIST_B_" + (string)m;
double current_lvl_p = g_active_display_data.profile_levels[m].price;
// Draw horizontal distribution segment via Trendline channels
ObjectCreate(0, obj_name_b, OBJ_TREND, 0, start_t, current_lvl_p, end_t, current_lvl_p);
ObjectSetInteger(0, obj_name_b, OBJPROP_COLOR, (g_active_display_data.profile_levels[m].buy_volume >= g_active_display_data.profile_levels[m].sell_volume) ? InpColorBuy : InpColorSell);
ObjectSetInteger(0, obj_name_b, OBJPROP_WIDTH, 2);
ObjectSetInteger(0, obj_name_b, OBJPROP_RAY_RIGHT, false);
ObjectSetInteger(0, obj_name_b, OBJPROP_SELECTABLE, false);
}
// 3. Populate Analytical Dashboard Metrics Panel Content fields
UpdateDashboardPanelData();
}
//--- Helper function tracking active visibility boundary constraints
int rates_total_mock_check() {
return((int)ChartGetInteger(0, CHART_FIRST_VISIBLE_BAR));
}
//+------------------------------------------------------------------+
//| Dashboard Management Helpers |
//+------------------------------------------------------------------+
void CreateDashboardPanel()
{
ObjectCreate(0, "PMP_PANEL_BG", OBJ_RECTANGLE_LABEL, 0, 0, 0);
ObjectSetInteger(0, "PMP_PANEL_BG", OBJPROP_XDISTANCE, 20);
ObjectSetInteger(0, "PMP_PANEL_BG", OBJPROP_YDISTANCE, 40);
ObjectSetInteger(0, "PMP_PANEL_BG", OBJPROP_XSIZE, 240);
ObjectSetInteger(0, "PMP_PANEL_BG", OBJPROP_YSIZE, 210);
ObjectSetInteger(0, "PMP_PANEL_BG", OBJPROP_BGCOLOR, clrBlack);
ObjectSetInteger(0, "PMP_PANEL_BG", OBJPROP_BORDER_COLOR, clrSlateGray);
ObjectSetInteger(0, "PMP_PANEL_BG", OBJPROP_BORDER_TYPE, BORDER_SUNKEN);
ObjectSetInteger(0, "PMP_PANEL_BG", OBJPROP_CORNER, CORNER_LEFT_UPPER);
ObjectSetInteger(0, "PMP_PANEL_BG", OBJPROP_SELECTABLE, false);
}
void UpdateDashboardText(string alert_msg)
{
string name = "PMP_TXT_ALERT";
ObjectCreate(0, name, OBJ_LABEL, 0, 0, 0);
ObjectSetInteger(0, name, OBJPROP_XDISTANCE, 35);
ObjectSetInteger(0, name, OBJPROP_YDISTANCE, 55);
ObjectSetInteger(0, name, OBJPROP_COLOR, clrWhite);
ObjectSetString(0, name, OBJPROP_TEXT, alert_msg);
ObjectSetString(0, name, OBJPROP_FONT, "Consolas");
ObjectSetInteger(0, name, OBJPROP_FONTSIZE, InpTextFontSize);
ObjectSetInteger(0, name, OBJPROP_CORNER, CORNER_LEFT_UPPER);
}
void UpdateDashboardPanelData()
{
int days_since = (int)((TimeCurrent() - g_active_display_data.last_visit_end) / 86400);
string metrics_labels[] = {
"PRICE MEMORY PROFILE",
"-------------------------",
"Last Visit: " + TimeToString(g_active_display_data.last_visit_end, TIME_DATE|TIME_MINUTES),
"Days Elapsed: " + (string)days_since + " days",
"Total Vol: " + (string)g_active_display_data.total_volume,
"Buy Vol : " + (string)g_active_display_data.buy_volume,
"Sell Vol : " + (string)g_active_display_data.sell_volume,
"Delta Vol: " + (string)g_active_display_data.delta_volume,
"POC Price: " + DoubleToString(g_active_display_data.poc_price, _Digits),
"VAH Range: " + DoubleToString(g_active_display_data.vah_price, _Digits),
"VAL Range: " + DoubleToString(g_active_display_data.val_price, _Digits),
"Time Spent: " + (string)(g_active_display_data.time_spent_seconds / 60) + " mins"
};
for(int i = 0; i < ArraySize(metrics_labels); i++)
{
string name = "PMP_PANEL_TXT_" + (string)i;
ObjectCreate(0, name, OBJ_LABEL, 0, 0, 0);
ObjectSetInteger(0, name, OBJPROP_XDISTANCE, 30);
ObjectSetInteger(0, name, OBJPROP_YDISTANCE, 50 + (i * 15));
ObjectSetInteger(0, name, OBJPROP_FONTSIZE, InpTextFontSize);
ObjectSetString(0, name, OBJPROP_FONT, "Consolas");
ObjectSetString(0, name, OBJPROP_TEXT, metrics_labels[i]);
ObjectSetInteger(0, name, OBJPROP_CORNER, CORNER_LEFT_UPPER);
ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
// Color coding logic assignments
if(i == 0) ObjectSetInteger(0, name, OBJPROP_COLOR, clrYellow);
else if(i == 5) ObjectSetInteger(0, name, OBJPROP_COLOR, InpColorBuy);
else if(i == 6) ObjectSetInteger(0, name, OBJPROP_COLOR, InpColorSell);
else if(i == 7) ObjectSetInteger(0, name, OBJPROP_COLOR, (g_active_display_data.delta_volume >= 0) ? clrDodgerBlue : clrDeepPink);
else if(i == 8) ObjectSetInteger(0, name, OBJPROP_COLOR, InpColorPOC);
else ObjectSetInteger(0, name, OBJPROP_COLOR, clrWhite);
}
}
void CreateHorizontalLine(string name, double price, color clr, ENUM_LINE_STYLE style, int width)
{
ObjectCreate(0, name, OBJ_HLINE, 0, 0, price);
ObjectSetInteger(0, name, OBJPROP_COLOR, clr);
ObjectSetInteger(0, name, OBJPROP_STYLE, style);
ObjectSetInteger(0, name, OBJPROP_WIDTH, width);
ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
}
