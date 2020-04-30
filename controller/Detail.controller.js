sap.ui.define([
	       		'jquery.sap.global',
	       		'sap/m/MessageToast',
	       		'fonddata/utils/Formatter',
	       		'fonddata/controller/BaseController',
	       		'sap/ui/model/json/JSONModel'
], function (jQuery, MessageToast, Formatter, BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("fonddata.controller.Detail", {

		onInit : function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("detail").attachMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched : function (oEvent) {
			var oArgs = oEvent.getParameter("arguments");
			var data_id = oArgs.data_id;
			var isin = oArgs.isin;
			var institutnr_fond = oArgs.institutnr_fond;
						
//			var url = "http://zink.re/stockinfund/data/index.php?dataid[]=" + oArgs.data_id;
			var url = "http://zink.re/stockinfund/details/index.php?stocks[]=" + oArgs.isin + "&funds[]=" + institutnr_fond;
			
//			MessageToast.show(url, {
//				width: "auto"
//			});

			var model = new sap.ui.model.json.JSONModel(url);
			this.getView().setModel(model);
			model.setSizeLimit(99999);
					
//			var oVerticalLayout = this.getView().byId('vLayout');
//			oVerticalLayout.bindElement("/Data/0");		
		},

		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},
		
		openHelp: function (oEvent) {					
			sap.m.URLHelper.redirect("./docs/fonddata.pdf", true);
		},
		
		openInfo: function (oEvent) {					
			// create popover
			if (! this._oInfoPopover) {
				this._oInfoPopover = sap.ui.xmlfragment("fonddata.view.Info", this);
				this.getView().addDependent(this._oInfoPopover);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oInfoPopover);			
			}
 
			// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
			var oButton = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function () {
				this._oInfoPopover.openBy(oButton);
			});			
		},
		
		openCompany: function (oEvent) {					
			// create popover
			if (! this._oCompanyPopover) {
				this._oCompanyPopover = sap.ui.xmlfragment("fonddata.view.Company", this);
				this.getView().addDependent(this._oCompanyPopover);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oCompanyPopover);			
			}
 
			// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
			var oButton = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function () {
				this._oCompanyPopover.openBy(oButton);
			});			
		},

		
		onExit : function () {
			if (this._oHelpPopover) {
				this._oHelpPopover.destroy();
			}

			if (this._oInfoPopover) {
				this._oInfoPopover.destroy();
			}

			if (this._oCompanyPopover) {
				this._oCompanyPopover.destroy();
			}
		}
	});

});
