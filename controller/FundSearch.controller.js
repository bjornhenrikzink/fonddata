sap.ui.define([
	       		'jquery.sap.global',
	       		'sap/m/MessageToast',
	       		'fonddata/utils/Formatter',
	       		'fonddata/controller/BaseController',
	    		'sap/ui/model/Filter',	       			       		
	       		'sap/ui/model/json/JSONModel'
], function (jQuery, MessageToast, Formatter, BaseController, Filter, JSONModel) {
	"use strict";
	
	var _DESCENDING = false
	var _type = null
	
	return BaseController.extend("fonddata.controller.FundSearch", {

		onInit : function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("fundSearch").attachMatched(this._onRouteMatched, this);
		},
		
		sort : function(sortkey, sortdescending) {
			  var SORTKEY = sortkey;
			  var DESCENDING = sortdescending;
			  var GROUP = false;
			  var oList = this.getView().byId("fundSearchList");
			  var oBinding = oList.getBinding("items");
			  var aSorter = [];

			  // You may use foo.bar.CustomSorter instead:
			  aSorter.push(new sap.ui.model.Sorter(SORTKEY, DESCENDING, GROUP));
			  oBinding.sort(aSorter);
		},
	
		_onRouteMatched : function (oEvent) {
			var oArgs = oEvent.getParameter("arguments");
			this._type = oArgs.type;
			
			var url = "http://zink.re/fonddata/funds/index.php";

			if (this._type == "hot") {
				url += "?type=hot";	
			} 
			else if (this._type == "cold") {
				url += "?type=cold";
			}			
			else if (this._type == "new") {
				url += "?type=new";
			}			
			else if (this._type == "closed") {
				url += "?type=closed";
			}			
			
			this.setModel(url);

			if (this._type == "all" | this._type == null) {
				this.sort("firma_fond", false);
			}
			
            // this.getView().byId("fundSearchField").setValue("");
			var sQuery = this.getView().byId("fundSearchField").getValue();
			this.fundSearch(sQuery);
		},
		
		setModel : function (url) {
			var model = new sap.ui.model.json.JSONModel(url);
			model.setSizeLimit(99999);
			this.getView().setModel(model);	
			
		    var oBinding = this.getView().byId("fundSearchList").getBinding("items");
		    oBinding.attachChange(function() {
			    this.getView().byId("listCount").setText("(" + oBinding.getLength() + ")");
		    }.bind(this));					
		},

		onFundSort : function() {
			this.openViewSettingsSort();
		},
		
		fundSearch : function (sQuery) { 
			// Add filter for search
			var aFilters = [];

			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("firma_fond", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}
 
			// Update list binding
			var list = this.getView().byId("fundSearchList");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		
		onFundSearch : function (oEvt) { 
			var sQuery = oEvt.getSource().getValue();
			this.fundSearch(sQuery);
		},

		onFundSearchListItemPressed : function(oEvent){
			var oItem, oCtx;

			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();
		
			this.getRouter().navTo("fundMaster",{
				fund: oCtx.getProperty("institutnr_fond"),
				type: this._type
			});
		},
		
		openViewSettingsSort: function (oEvent) {
			if (! this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("fonddata.view.SearchViewSettings", this);
			}
			
	        // Set i18n model
	        var i18nModel = new sap.ui.model.resource.ResourceModel({
	            bundleUrl : "utils/i18n.properties"
	        });
	        this._oDialog.setModel(i18nModel, "i18n");			
			
        	// Toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},
		
		handleConfirm: function (oEvent) {			
			// Sort			
			var sortItem = oEvent.getParameters().sortItem;
			var sortDescending = oEvent.getParameters().sortDescending;
			
			if (sortItem) {
				var sortItemKey = sortItem.getProperty("key");
				this.sort(sortItemKey, sortDescending);
			}
			else {
				this.sort("firma_fond", sortDescending);					
			}
		},
		
		openHelp: function (oEvent) {					
			sap.m.URLHelper.redirect("./docs/fonddata.pdf", true);	
		},
		
		openInfo: function (oEvent) {					
			// Create popover
			if (! this._oInfoPopover) {
				this._oInfoPopover = sap.ui.xmlfragment("fonddata.view.Info", this);
				this.getView().addDependent(this._oInfoPopover);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oInfoPopover);			
			}
 
			// Delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
			var oButton = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function () {
				this._oInfoPopover.openBy(oButton);
			});			
		},
		
		openCompany: function (oEvent) {					
			// Create popover
			if (! this._oCompanyPopover) {
				this._oCompanyPopover = sap.ui.xmlfragment("fonddata.view.Company", this);
				this.getView().addDependent(this._oCompanyPopover);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oCompanyPopover);			
			}
 
			// Delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
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
