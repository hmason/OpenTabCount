var tabcount = {

	initialize : function() {
		this.removeEventListener('load', tabcount.initialize, false);
		this.addEventListener('unload', tabcount.uninitialize, false);
	
		var container = gBrowser.tabContainer;
		container.addEventListener("TabOpen", tabcount.updateStatusTimeout, false);
		container.addEventListener("TabClose", tabcount.updateStatusTimeout, false);
		window.addEventListener("focus", tabcount.updateStatusTimeout, false);

		tabcount.updateStatusTimeout();
	},
   
	uninitialize : function() {
		
		this.removeEventListener('unload', tabcount.uninitialize, false);
	
		var container = gBrowser.tabContainer;
		container.removeEventListener("TabOpen", tabcount.updateStatusTimeout, false);
		container.removeEventListener("TabClose", tabcount.updateStatusTimeout, false);
		tabcount = null;
	},
	
	tabOpen : function(e) {
		tabcount.updateStatusTimeout();
	},

	tabClose : function(e) {
		tabcount.updateStatusTimeout();
	},
	
	updateStatusTimeout: function() {
		window.setTimeout("tabcount.updateStatus()", 5);
	},
	
	updateStatus : function() {
		var wm = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
		var total_count = tabcount.countAllTabs(wm);
		
		var windowIter = wm.getEnumerator('navigator:browser');
		
		while (windowIter.hasMoreElements()) {
			currentWindow = windowIter.getNext();
			current_tabs = currentWindow.document.getElementById("content").mTabs.length;
			currentWindow.document.getElementById("tabcount_label").value = current_tabs;
			
			if (current_tabs == total_count) { // only display total if we have more than one window
				currentWindow.document.getElementById("tabcount_total_label").value = "";
				currentWindow.document.getElementById("tabcount_sep").value = "";
			} else {
				currentWindow.document.getElementById("tabcount_sep").value = "/";
				currentWindow.document.getElementById("tabcount_total_label").value = total_count;	
			}
		}
	},
	
	countAllTabs: function(wm) {
		// var wm = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
		// 
		var windowIter = wm.getEnumerator('navigator:browser');
		var currentWindow;	
		var tabCount = 0;
		while (windowIter.hasMoreElements()) {
			currentWindow = windowIter.getNext();
			tabCount += currentWindow.document.getElementById("content").mTabs.length;
		}

		return tabCount;
	},
}

window.addEventListener('load', tabcount.initialize, false);
