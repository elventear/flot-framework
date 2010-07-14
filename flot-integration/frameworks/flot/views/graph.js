// ==========================================================================
// Project:   Flot.GraphView
// Copyright: ©2010 Bo Xiao <mail.xiaobo@gmail.com>, Inc.
// ==========================================================================
/*globals Flot */

/** @class

  (Document Your View Here)

  @extends SC.View
*/

sc_require('core.js');
Flot.GraphView = SC.View.extend(
/** @scope Flot.GraphView.prototype */ {
	series: null,
	data: null,
	options: null,
	title: null,
	debugInConsole: true ,
	render: function(context, firstTime) {
		var title = this.get('title'),
			frame = this.get('frame');
		
		if (!SC.none(title)) {
			context = context.begin().
				addClass('flot-graphview-title').push(title).end();
			context = context.begin().
				addClass('flot-graphview-graph').end();
		}
		
		this.set('layerNeedsUpdate', YES);
		sc_super();
	},
	updateLayer: function() {
		
		var title = this.get('title'),
			frame = this.get('frame'),
			layer, height, width;
		
		width = frame.width;
		if (SC.none(title)) {
			layer = this.get('layer');
			height = frame.height;
		} else {
			layer = this.$('div.flot-graphview-graph')[0];
			var titleLayer = this.$('div.flot-graphview-title')[0],
				parentLayer = this.get('layer');
			
			height = frame.height-titleLayer.clientHeight;
			if (height < 0) height = 0;
			layer.style.height = height+'px';
			
			width = parentLayer.clientWidth;
			layer.style.width = width+'px';
		}
		
		if(layer && this.get('isVisibleInWindow')) {
			if((width > 0) && (height > 0)) {
				var data = this.get('data'),
				series = this.get('series');
				
				if (!SC.empty(data)) {
					Flot.plot(layer, data.toArray(),
						this.get('options'));
					if (this.debugInConsole) console.log('render data');
				} else if (!SC.empty(series)) {
					Flot.plot(layer, series.toArray(),
						this.get('options'));
					if (this.debugInConsole) console.log('render series');
				} else {
					if (this.debugInConsole) console.warn('data was empty');
				}
			}
		}
	},
	titleDidChange: function() {
		this.setLayerNeedsUpdate() ;
		if (this.debugInConsole) console.log('title changed');
	}.observes('.title'),
	plotDataDidChange: function() {
		this.setLayerNeedsUpdate() ;
		if (this.debugInConsole) console.log('data changed');
	}.observes('.data','.data.[]'),
	plotOptionsDidChange: function() {
		this.setLayerNeedsUpdate() ;
		if (this.debugInConsole) console.log('options changed');	
	}.observes('.options'),
	visibilityDidChange: function() {
		if(this.get('isVisibleInWindow') && this.get('isVisible')) {
			if (this.debugInConsole) console.log('visibility changed');
			this.setLayerNeedsUpdate() ;
		}		
	}.observes('isVisibleInWindow','isVisible'),
	layerDidChange: function() {
		if (this.debugInConsole) console.log('layerchanged');
		this.setLayerNeedsUpdate() ;	
	}.observes('layer'),
	layoutDidChange: function() {
		sc_super();
		if (this.debugInConsole) console.log('layout changed');
		this.setLayerNeedsUpdate() ;
	},
	updateLayerLocationIfNeeded: function() {
		sc_super() ;
		if (this.debugInConsole) console.log('layer location update');
		this.setLayerNeedsUpdate() ;
	},
	setLayerNeedsUpdate: function() {
		this.invokeOnce(function() {
			this.set('layerNeedsUpdate', YES);
			if (this.debugInConsole) console.log('need update') ;
		});
		
	},
	viewDidResize: function() {
		sc_super();
		this.setLayerNeedsUpdate() ;
		if (this.debugInConsole) console.log('view did resize');
	}.observes('layout'),
	parentViewDidResize : function() {
		sc_super();
		this.setLayerNeedsUpdate();
		if (this.debugInConsole) console.log('parent did resize');
	}

});
