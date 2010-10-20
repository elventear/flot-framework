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
	debugInConsole: true,
	parentLayer: null,
	titleLayer: null,
	graphLayer: null,
	legendLayer: null,
	legendHeightPx: 50,
	outsideLegend: false,
	init: function () {
		sc_super();
		var options = this.get('options'),
			legendOptions;
		
		if (!options) options = {};
		if (this.get('outsideLegend')) {
			legendOptions = options['legend'];
			if (!legendOptions) {
				legendOptions = {};
				options['legend'] = legendOptions;
			}
			legendOptions['show'] = true;
			legendOptions['container'] = null;
		}
			
			
	},
	render: function(context, firstTime) {
		var frame = this.get('frame'),
		    myHash = SC.hashFor(this);
		
		context.
			begin().addClass('flot-graphview').id(myHash).
			begin().addClass('flot-graphview-title').id(myHash+'-1').end().
			begin().addClass('flot-graphview-graph').id(myHash+'-2').end().
			begin().addClass('flot-graphview-legend').id(myHash+'-3').end()
			.end();
		this.set('layerNeedsUpdate', YES);
		sc_super();
	},
	updateLayer: function() {
		var title = this.get('title'),
			frame = this.get('frame'),
			graphLayer = this.get('graphLayer'), 
			titleLayer = this.get('titleLayer'),
			legendLayer = this.get('legendLayer'),
			parentLayer = this.get('parentLayer'),
			options = this.get('options'),
			width = frame.width,
			height, legendOptions;
		
		
		if ( !this.get('layer') || ! this.get('isVisibleInWindow')) return;
		if ((frame.width <= 0) || (frame.height <= 0)) return;
		
		width = 0.95*width;
		
		if (!parentLayer) {
			parentLayer = this.$('div.flot-graphview')[0];
			this.set('parentLayer', parentLayer);
		}
		parentLayer.style.width = width+'px';
		
		if (!graphLayer) {
			graphLayer = this.$('div.flot-graphview-graph')[0];
			this.set('graphLayer', graphLayer);
		}
		
		if (!titleLayer) {
			titleLayer = this.$('div.flot-graphview-title')[0];
			this.set('titleLayer', titleLayer);
		}
		
		if (!legendLayer) {
			legendLayer = this.$('div.flot-graphview-legend')[0];
			this.set('legendLayer', legendLayer);
		}
		legendLayer.style.height = this.get('legendHeightPx')+'px';
		legendLayer.style.width = width+'px';
		
		if (titleLayer && title) {
			titleLayer.innerHTML = title;
		}
		
		if (this.get('outsideLegend')) {
			legendOptions = options['legend'];
			legendOptions['container'] = legendLayer;
		}
		
		height = frame.height-(titleLayer.clientHeight+legendLayer.clientHeight);
		if (height < 0) height = 0;
		graphLayer.style.height = height+'px';
	
		width = parentLayer.clientWidth;
		graphLayer.style.width = width+'px';
		
		if(graphLayer && this.get('isVisibleInWindow')) {
			if((width > 0) && (height > 0)) {
				var data = this.get('data'),
				series = this.get('series');
				
				if (!SC.empty(data)) {
					Flot.plot(graphLayer, data.toArray(), options);
					if (this.debugInConsole) console.log('render data');
				} else if (!SC.empty(series)) {
					Flot.plot(graphLayer, series.toArray(), options);
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
	plotSeriesDidChange: function() {
		this.setLayerNeedsUpdate() ;
		if (this.debugInConsole) console.log('series changed');
	}.observes('.series','.series.[]'),
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
	}.observes('layer'),
	viewDidResize: function() {
		sc_super();
		this.setLayerNeedsUpdate() ;
		if (this.debugInConsole) console.log('view did resize');
	}.observes('layout'),
	parentViewDidResize : function() {
		sc_super();
		this.setLayerNeedsUpdate();
		if (this.debugInConsole) console.log('parent did resize');
	},
	selectionDidChange: function () {
		var layer = this.get('layer'),
			isSelected = this.get('isSelected'),
			className, sel;
			
		if (!layer) return;
		className = layer.className;
		if (!className) return;
		
		sel = layer.className.match('sel');
		if(isSelected && !sel) {
			layer.className = className+' sel';
		} else if (!isSelected && sel) {
			layer.className = className.replace('sel', '');
		} else return;
		this.setLayerNeedsUpdate();
	}.observes('isSelected')
	
});
