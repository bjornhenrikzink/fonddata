sap.ui.define([
	       		'sap/ui/core/format/NumberFormat'
], function (NumberFormat) {
	"use strict";
    
	var Formatter = {
			numberFormat : function (number) {
				
			if(number == "-") {
				return number;
			}
			else {
				var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				  maxFractionDigits: 2,
				  groupingEnabled: true,
				  groupingSeparator: " ",
				  decimalSeparator: ","
				}); //Returns a NumberFormat instance for float
				
				return oNumberFormat.format(number);	
			}
		},	

		pct : function (sTrend) {
				var fTrend = parseFloat(sTrend);
				var fPct = fTrend*100;
				
				var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
					  maxFractionDigits: 4,
					  groupingEnabled: true,
					  groupingSeparator: " ",
					  decimalSeparator: ","
					}); //Returns a NumberFormat instance for float
				
				var oPct = oNumberFormat.format(fPct);
				
				var sPct = oPct + "%";
				return sPct;
		},	

		trendPct : function (sTrend) {
				var fTrend = parseFloat(sTrend);
				var pct = parseInt((fTrend - 1)*100);
			
				if (fTrend > 1) {	
					var up = "+" + pct +"%";
					return up;
				} else if (fTrend < 1 & fTrend > 0) {
					var down = pct +"%";
					return down;
				} else if (fTrend == 0){
					return "New";
				} else if (fTrend == -1){
					return "Sold";
				} else {
					var neutral = "+" + pct + "%";
					return neutral;
				}
		},
	
		trendIcon : function (sTrend) {
			if (sTrend > 1 ) {
		return "sap-icon://arrow-top";
			} else if (sTrend < 1 & sTrend > 0) {
				return "sap-icon://arrow-bottom";
			} else if (sTrend == 0){
				return "sap-icon://favorite";
			} else if (sTrend == -1){
				return "sap-icon://decline";
			} else {
				return "sap-icon://arrow-right";
			}
		}	
	};

	return Formatter;

}, /* bExport= */ true);
