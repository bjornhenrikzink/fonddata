sap.ui.define([
	       		'jquery.sap.global',
	       		'sap/m/MessageToast',
	       		'fonddata/utils/Formatter',
	    		'sap/ui/model/Filter',	       		
	       		'fonddata/controller/BaseController',
	       		'sap/ui/model/json/JSONModel'
], function (jQuery, MessageToast, Formatter, Filter, BaseController, JSONModel) {
	"use strict";
	
	var _type = null;
    //	var _aFilter = [];
    //	var _oSearchFilter;
	
	return BaseController.extend("fonddata.controller.StockMaster", {

		onInit : function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("stockMaster").attachMatched(this._onRouteMatched, this);
		},		
			
		sort : function(sortkey, sortdescending) {
			  var SORTKEY = sortkey;
			  var DESCENDING = sortdescending;
			  var GROUP = false;
			  var oList = this.getView().byId("stockMasterList");
			  var oBinding = oList.getBinding("items");
			  var aSorter = [];
			  // you may use foo.bar.CustomSorter instead:
			  aSorter.push(new sap.ui.model.Sorter(SORTKEY, DESCENDING, GROUP));
			  oBinding.sort(aSorter);
		},		
		
		filter : function(filterItems, sQuery) { 
			// add filter for search
			var aFilter = [];

			for(var i = 0; i < filterItems.length; i++) {  				
				var filterKey = filterItems[i].getProperty("key");
				
				if (filterKey == "new") {
					var filter = new Filter("inst_antal_trend", sap.ui.model.FilterOperator.EQ, "0.00");
					aFilter.push(filter);
				}
				
				if (filterKey == "up") {
					var filter = new Filter("weight_trend", sap.ui.model.FilterOperator.GT, "1.00");										
					aFilter.push(filter);
				}
				
				if (filterKey == "neutral") {
					var filter = new Filter("weight_trend", sap.ui.model.FilterOperator.EQ, "1.00");														
					aFilter.push(filter);
				}
				
				if (filterKey == "down") {
					var filter = new Filter("weight_trend", sap.ui.model.FilterOperator.BT, "0.1", "0.99");														
					aFilter.push(filter);
				}
				
				if (filterKey == "sold") {
					var filter = new Filter("inst_antal_trend", sap.ui.model.FilterOperator.EQ, "-1");														
					aFilter.push(filter);
				}	
			}	
			
			// search function			
			if(sQuery && sQuery.length > 0) {
				var searchFilter = new Filter("firma_fond", sap.ui.model.FilterOperator.StartsWith, sQuery);
				aFilter.push(searchFilter);
			}	
			
			// update list binding
			var list = this.getView().byId("stockMasterList");
			var binding = list.getBinding("items");
			binding.filter(aFilter, "Application");
		},		
		
		_onRouteMatched : function (oEvent) {
			var oArgs = oEvent.getParameter("arguments");
			var stock = oArgs.stock;
			this._type = oArgs.type;
						
			var url = "http://zink.re/fonddata/data/index.php";
			
			if(stock != null) {
				url += "?stocks[]=" + stock;
			}
									
            // MessageToast.show(url, {
            // width: "auto"
            // });
			
			var model = new sap.ui.model.json.JSONModel(url);
			model.setSizeLimit(99999);
			this.getView().setModel(model);	
			
		    var oBinding = this.getView().byId("stockMasterList").getBinding("items");		    
		    
		    var sumUrl = "http://zink.re/fonddata/data/index.php";

			if(stock != null) {
				sumUrl += "?sumstocks[]=" + stock;
			}

		    var sumModel = new sap.ui.model.json.JSONModel(sumUrl);
		    
		    this.getView().byId("assetMasterListTitle").setModel(sumModel);
		    this.getView().byId("pctNavTot").setModel(sumModel);
		    this.getView().byId("stockMasterListFundsTot").setModel(sumModel);
		    this.getView().byId("stockMasterListSharesTot").setModel(sumModel);
		    this.getView().byId("stockMasterListValueTot").setModel(sumModel);
		    	    
		    var filterItems = [];

		    // If sort and filter is already set reapply them
			// For example, after navigating back
			if (this._oDialog) {
                // Filter items
				var viewSettings = this._oDialog;
				filterItems = viewSettings.getSelectedFilterItems();

                // Sort items		
				var sortItemId = viewSettings.getSelectedSortItem();
				var sortItems = viewSettings.getSortItems();
				
				for(var i = 0; i < sortItems.length; i++) {
					if(sortItems[i].sId === sortItemId) {
						var sortItem = sortItems[i];
						
						var sortItemKey = sortItem.getProperty("key");
						var sortDesc = viewSettings.getSortDescending();
						this.sort(sortItemKey, sortDesc);

						break;
					}
				}
			}
			
			var sQuery = this.getView().byId("fundSearchField").getValue();
			this.filter(filterItems, sQuery);
		},
		
		onFundSearch : function (oEvt) { 
			// add filter for search
			var sQuery = oEvt.getSource().getValue();
						
		    var filterItems = [];

		    // If sort and filter is already set reapply them
			// For example, after navigating back
			if (this._oDialog) {
				var viewSettings = this._oDialog;
				filterItems = viewSettings.getSelectedFilterItems();				
			}			
			
			this.filter(filterItems, sQuery);
		},		
				
		onListItemPressed : function(oEvent){
			var oItem, oCtx;

			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();
		
			this.getRouter().navTo("detail",{
				data_id: oCtx.getProperty("data_id"),
				isin: oCtx.getProperty("isin"),
				institutnr_fond: oCtx.getProperty("institutnr_fond")
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
		},

		openViewSettingsSort: function (oEvent) {
			if (! this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("fonddata.view.MasterViewSettings", this);
				
		        // set i18n model
		        var i18nModel = new sap.ui.model.resource.ResourceModel({
		            bundleUrl : "utils/i18n.properties"
		        });
		        this._oDialog.setModel(i18nModel, "i18n");			

		        // toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			}
			
			this._oDialog.open();
		},

		openViewSettingsFilter: function (oEvent) {
			if (! this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("fonddata.view.MasterViewSettings", this);
		        // set i18n model
		        var i18nModel = new sap.ui.model.resource.ResourceModel({
		            bundleUrl : "utils/i18n.properties"
		        });
		        
		        this._oDialog.setModel(i18nModel, "i18n");			
		        
				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			}
			
			this._oDialog.open("filter");
		},

		handleConfirm: function (oEvent) {			
            // Sort			
			var sortItem = oEvent.getParameters().sortItem;
			
			if (sortItem) {
				var sortItemKey = sortItem.getProperty("key");
				var sortDescending = oEvent.getParameters().sortDescending;
				this.sort(sortItemKey, sortDescending);
                // MessageToast.show("Sorting: " + sortItem.getProperty("key") + " " + sortItem.getProperty("text"));
			}
			
            // Filters
			var filterItems = [];
			filterItems = oEvent.getParameters().filterItems;
			
			var sQuery = this.getView().byId("fundSearchField").getValue();

			this.filter(filterItems, sQuery);
		},		

		onNavStockSearch: function (oEvent) {
			this.getRouter().navTo("stockSearch", 
					{type: this._type}, 
					true /*no history*/);
		}			
	});

	return BaseController;
});
