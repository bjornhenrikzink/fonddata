sap.ui.define([
	       		'jquery.sap.global',
	       		'sap/m/MessageToast',
	       		'fonddata/controller/BaseController',
	       		'sap/ui/model/json/JSONModel'
	       	], function(jQuery, MessageToast, Controller, JSONModel) {
	       	"use strict";
	       		       	
			 var PageController = Controller.extend("fonddata.controller.Home", {		 
				onInit : function() {
					this._router = sap.ui.core.UIComponent.getRouterFor(this);	
					
//					var sTheme = jQuery.sap.getUriParameters().get("sap-theme"); 
//					
//					if(sTheme == "sap_hcb") {
//						this.getView().byId("themeSwitch").setState(false);						
//					}
				},
								
				openHelp: function (oEvent) {					
					sap.m.URLHelper.redirect("./docs/fonddata.pdf", true);
				},
				
				openAd: function (oEvent) {					
					sap.m.URLHelper.redirect("http://www.nordnet.se", true);
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

				openAbout: function (oEvent) {					
					// create popover
					if (! this._oAboutPopover) {
						this._oAboutPopover = sap.ui.xmlfragment("fonddata.view.About", this);
						this.getView().addDependent(this._oAboutPopover);
						jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oAboutPopover);			
					}
		 
					// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
					var oButton = oEvent.getSource();
					jQuery.sap.delayedCall(0, this, function () {
						this._oAboutPopover.openBy(oButton);
					});			
				},
				
				
				changeTheme : function (oEvent) {
					var bState = oEvent.getParameter("state");
					
					if(bState) {
						sap.ui.getCore().applyTheme("sap_bluecrystal"); 						
						//sap.m.URLHelper.redirect("./?sap-theme=sap_bluecrystal", false);
					}
					else {
						//sap.m.URLHelper.redirect("./?sap-theme=sap_hcb", false);
						sap.ui.getCore().applyTheme("sap_hcb"); 						
					}
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

					if (this._oAboutPopover) {
						this._oAboutPopover.destroy();
					}
				},
				
				onDisplayNotFound : function (oEvent) {
					// display the "notFound" target without changing the hash
					this.getRouter().getTargets().display("notFound", {
						fromTarget : "home"
					});		
				},
		
				onNavToStockSearch : function (oEvent) {
					var type = oEvent.getSource().data("type");
					
//					MessageToast.show(type, {
//					width: "auto"
//					});
					
					this.getRouter().navTo("stockSearch",{
						type: type				
					});					
				},		
		
				onNavToFundSearch : function (oEvent) {	
//					this.getRouter().navTo("fundSearch");

					var type = oEvent.getSource().data("type");
					
//					MessageToast.show(type, {
//					width: "auto"
//					});
					
					this.getRouter().navTo("fundSearch",{
						type: type				
					});							
				}
			});
			return PageController;
});
