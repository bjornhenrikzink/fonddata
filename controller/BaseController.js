sap.ui.define([
	'sap/m/MessageToast',               
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"	
], function (MessageToast, Controller, History) {
	"use strict";

	return Controller.extend("fonddata.controller.BaseController", {

		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("appHome", {}, true /*no history*/);
			}
		},
		
		onNavHome: function (oEvent) {
				this.getRouter().navTo("appHome", {}, true /*no history*/);
		}	
	});

});
