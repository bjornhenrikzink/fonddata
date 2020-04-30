	sap.ui.define([
	       		'jquery.sap.global',
	       		'sap/m/MessageToast',
	       		'fonddata/utils/Formatter',     		
	       		'fonddata/utils/StringFormatter',     		
	       		'fonddata/controller/BaseController',
	    		'sap/ui/model/Filter',	       		
	       		'sap/ui/model/json/JSONModel'
], function (jQuery, MessageToast, Formatter, StringFormatter, BaseController, Filter, JSONModel) {
	"use strict";

	var _DESCENDING = null;
	var _type = null;
	var _sSortBy = "total_value"
//	var _sSortBy = "total_weight";
	
	return BaseController.extend("fonddata.controller.StockSearch", {

		onInit : function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("stockSearch").attachMatched(this._onRouteMatched, this);
		},		
	
		_onRouteMatched : function (oEvent) {
			var oArgs = oEvent.getParameter("arguments");
			this._type = oArgs.type;
			
			var url = "http://zink.re/stockinfund/stocks/index.php";

			if (this._type == "hot") {
				url += "?type=hot";	
			} 
			else if (this._type == "cold") {
				url += "?type=cold";
			}
			else if (this._type == "new") {
				url += "?type=new";
			}
			else if (this._type == "sold") {
				url += "?type=sold";
			}
			
			var model = new sap.ui.model.json.JSONModel(url);
			model.setSizeLimit(99999);			
			this.getView().setModel(model);	
			
		    var oBinding = this.getView().byId("stockSearchList").getBinding("items");
		    oBinding.attachChange(function() {
			    var listCount = Formatter.numberFormat(oBinding.getLength());
			    this.getView().byId("listCount").setText("(" + listCount + ")");
		    }.bind(this));			

//			this.getView().byId("stockSearchField").setValue("");
			var sQuery = this.getView().byId("stockSearchField").getValue();
			this.stockSearch(sQuery);
			
			if (this._type == "all" | this._type == null) {
				this.sort(_sSortBy, true);
			}
		},
				
		sort : function(sKey, bDescending) {
			  var SORTKEY = sKey;
			  this._DESCENDING = bDescending;
			  var GROUP = false;
			  var oList = this.getView().byId("stockSearchList");
			  var oBinding = oList.getBinding("items");
			  var aSorter = [];
			  // you may use foo.bar.CustomSorter instead:
			  aSorter.push(new sap.ui.model.Sorter(SORTKEY, this._DESCENDING, GROUP));
			  oBinding.sort(aSorter);
		},
				
		onStockSort : function() {
			if(this._DESCENDING == true) {
				this.sort(_sSortBy, false);
			}
			else {
				this.sort(_sSortBy, true);
			}
		},	
		

		openAssetViewSettings: function (oEvent) {
			if (! this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("fonddata.view.AssetViewSettings", this);
				
		        // set i18n model
		        var i18nModel = new sap.ui.model.resource.ResourceModel({
		            bundleUrl : "utils/i18n.properties"
		        });
		        this._oDialog.setModel(i18nModel, "i18n");			
//				this._oDialog.setModel(this.getView().getModel());

		        // toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			}
			
			this._oDialog.open();
		},		
		
		handleConfirm: function (oEvent) {			
			// Sort			
			var sortItem = oEvent.getParameters().sortItem;
						
			if (sortItem) {
				var sortItemKey = sortItem.getProperty("key");
				var sortDescending = oEvent.getParameters().sortDescending;
				this.sort(sortItemKey, sortDescending);
//							MessageToast.show("Sorting: " + sortItem.getProperty("key") + " " + sortItem.getProperty("text"));
			}
		},			
		
		stockSearch : function (sQuery) { 
			// add filter for search
			var aFilters = [];

			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("instrumentnamn", sap.ui.model.FilterOperator.StartsWith, sQuery);
				aFilters.push(filter);
			}
			
			// update list binding
			var list = this.getView().byId("stockSearchList");
			var binding = list.getBinding("items");
			binding.filter(aFilters);
			
		},
		
		
		onStockSearch : function (oEvt) { 
			var sQuery = oEvt.getSource().getValue();
			this.stockSearch(sQuery);
		},
				
		onStockSearchListItemPressed : function(oEvent) {
			var oItem, oCtx;

			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();
		
			this.getRouter().navTo("stockMaster",{
				stock: oCtx.getProperty("isin"),
				type: this._type
			});
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

	return BaseController;
});
