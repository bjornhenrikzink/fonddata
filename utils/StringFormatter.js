sap.ui.define([
	       		'sap/ui/model/type/String'
], function (String) {
	"use strict";
    
	var StringFormatter = {
			stringFormat : function (v) {
			return v.toString();		
		}
	};

	return StringFormatter;

}, /* bExport= */ true);
