$(function(){

  var layoutPadding = 20;
  var layoutDuration = 1200;

  //get from database
  var graphP = $.ajax({
    url: '/json/raw.json',
    type: 'GET',
    dataType: 'json',
  });

  var styleP = $.ajax({
    url: '/json/style.cycss',
    type: 'GET',
    dataType: 'text'
  });

  var infoTemplate = Handlebars.compile([
    '{{#if Description.brief}}<p class="ac-milk">{{{Description.brief}}}</p>{{else}}{{/if}}',
    '{{#if Blurb}}<p class="blurb">{{{Blurb}}}</p>{{else}}{{/if}}',
  ].join(''));

  // when both graph export json and style loaded, init cy
  Promise.all([ graphP, styleP ]).then(initCy);

  function highlight( node ){
    var nhood = node.closedNeighborhood();

    cy.batch(function(){

      cy.elements().not( nhood ).removeClass('highlighted').addClass('faded');
      nhood.removeClass('faded').addClass('highlighted');

      var npos = node.position();
      var w = window.innerWidth;
      var h = window.innerHeight;

      cy.stop().animate({
        fit: {
          eles: cy.elements(),
          padding: layoutPadding
        }
      }, {
        duration: layoutDuration
      }).delay( layoutDuration, function(){
        nhood.layout({
          name: 'circle', // or concentru
          padding: layoutPadding,
          animate: true,
          animationDuration: layoutDuration,
          boundingBox: {
            x1: npos.x - w/40,
            x2: npos.x + w/40,
            y1: npos.y - w/01,
            y2: npos.y + w/40
          },
          fit: true,
          concentric: function( n ){
            if( node.id() === n.id() ){
              return 2;
            } else {
              return 1;
            }
          },
          levelWidth: function(){
            return 1;
          }
        });
      } );

    });
  }

  function clear(){
    cy.batch(function(){
      cy.$('.highlighted').forEach(function(n){
        n.animate({
          position: n.data('orgPos')
        });
      });

      cy.elements().removeClass('highlighted').removeClass('faded');
    });
  }

  function showNodeInfo( node ){
    $('#info').html( infoTemplate( node.data() ) ).show();
  }

  function hideNodeInfo(){
    $('#info').hide();
  }

  function initCy( then ){

    //get from database
    var nodes = $.ajax({
      url: '/api/node/list',
      type: 'GET',
      dataType: 'json',
    }).done(function(nodes) {
      console.log(nodes);
      window.nodes = nodes;
      cy.add(nodes);
    });

    //get from database
    var edges = $.ajax({
      url: '/api/edge/list',
      type: 'GET',
      dataType: 'json',
    }).done(function(edges) {
      console.log(edges);
      window.edges = edges;
      cy.add(edges);
    });

    var loading = document.getElementById('loading');
    var expJson = then[0];
    var styleJson = then[1];
    var elements = expJson.elements;

    elements.nodes.forEach(function(n){
      var data = n.data;

      data.NodeTypeFormatted = data.NodeType;

      /*if( data.NodeTypeFormatted === 'CreAction' ){
        data.NodeTypeFormatted = 'creaction';
      } else if( data.NodeTypeFormatted === 'Main' ){
        data.NodeTypeFormatted = 'main';
      }*/

      n.data.orgPos = {
        x: n.position.x,
        y: n.position.y
      };
    });

    loading.classList.add('loaded');

    var cy = window.cy = cytoscape({
      container: document.getElementById('cy'),
      layout: { name: 'preset', padding: layoutPadding },
      style: styleJson,
      elements: elements,
      motionBlur: true,
      selectionType: 'single',
      boxSelectionEnabled: false,
      autoungrabify: true
    });

    cy.on('free', 'node', function( e ){
      var n = e.cyTarget;
      var p = n.position();

      n.data('orgPos', {
        x: p.x,
        y: p.y
      });
    });

    cy.on('tap', function(){
      $('#search').blur();
    });

    cy.on('select', 'node', function(e){
      var node = this;

      //get from database
      var nodes = $.ajax({
        url: '/api/node/list',
        type: 'GET',
        dataType: 'json',
      }).done(function(nodes) {
        console.log(nodes);
        window.nodes = nodes;
        cy.add(nodes);
      });

      //get from database
      var edges = $.ajax({
        url: '/api/edge/list',
        type: 'GET',
        dataType: 'json',
      }).done(function(edges) {
        console.log(edges);
        window.edges = edges;
        cy.add(edges);
      });

      if (this.attr('Main')) {

        var layout = cy.makeLayout({ name: 'concentric' });
        layout.run();

        cy.fit( cy.$(':selected'), 100 );

        highlight( node );
        };

      //clear();
      showNodeInfo( node );

    });

    cy.on('mouseover', 'node', function(e) {
      var node = this;

      $('html,body').css('cursor', 'pointer');

      //get from database
      var nodes = $.ajax({
        url: '/api/node/list',
        type: 'GET',
        dataType: 'json',
      }).done(function(nodes) {
        console.log(nodes);
        window.nodes = nodes;
        cy.add(nodes);
      });

      //get from database
      var edges = $.ajax({
        url: '/api/edge/list',
        type: 'GET',
        dataType: 'json',
      }).done(function(edges) {
        console.log(edges);
        window.edges = edges;
        cy.add(edges);
      });


        /*if (this.attr('Blurb')) {
          this.qtip({
               content: this.attr('Blurb'),
               show: {
                  event: event.type,
                  //start: true
               },
               api: {
                 onHide: function(event, api) {
                   api.destroy();
                 }
               },
               position: {
                my: 'center',
                at: 'center',
                  adjust: {
                    y: -17,
                    mouse: false
                  }
                },
               style: {
                 classes: 'qtip-bootstrap',
               },
               hide: {
                  event: 'click mouseout'
               }

          }, event);

      };*/

        //this.addClass('mouseover');
        //showNodeInfo( node );

    });

    cy.on('mouseout', 'node', function(e) {
      var node = this;

      $('html,body').css('cursor', 'default');

      //this.removeClass('mouseover');
      //hideNodeInfo( node );
    });

    cy.on('unselect', 'node', function(e){
      var node = this;
      clear();
      hideNodeInfo();
    });

  }

  $('#search').typeahead({
    minLength: 2,
    highlight: true,
  },
  {
    name: 'search-dataset',
    source: function( query, cb ){
      function matches( str, q ){
        str = (str || '').toLowerCase();
        q = (q || '').toLowerCase();

        return str.match( q );
      }

      var fields = ['name', 'NodeType', 'Country', 'Type', 'Milk'];

      function anyFieldMatches( n ){
        for( var i = 0; i < fields.length; i++ ){
          var f = fields[i];

          if( matches( n.data(f), query ) ){
            return true;
          }
        }

        return false;
      }

      function getData(n){
        var data = n.data();

        return data;
      }

      function sortByName(n1, n2){
        if( n1.data('name') < n2.data('name') ){
          return -1;
        } else if( n1.data('name') > n2.data('name') ){
          return 1;
        }

        return 0;
      }

      var res = cy.nodes().stdFilter( anyFieldMatches ).sort( sortByName ).map( getData );

      cb( res );
    },
    templates: {
      suggestion: infoTemplate
    }
  }).on('typeahead:selected', function(e, entry, dataset){
    var n = cy.getElementById(entry.id);

    n.select();
    showNodeInfo( n );
  });

  $('#reset').on('click', function(){
    cy.animate({
      fit: {
        eles: cy.elements(),
        padding: 10
      },
      duration: 100
    });
    window.location.reload();
  });

  $('#filters').on('click', 'input', function(){

    var creaction = $('#creaction').is(':checked');
    var events = $('#events').is(':checked');
    var wandering = $('#wandering').is(':checked');
    var moving = $('#moving').is(':checked');
    var reflection = $('#reflection').is(':checked');

    var red = $('#red').is(':checked');
    var white = $('#white').is(':checked');
    var cider = $('#cider').is(':checked');

    cy.batch(function(){

      cy.nodes().forEach(function( n ){
        var type = n.data('NodeType');

        n.removeClass('filtered');

        var filter = function(){
          n.addClass('filtered');
        };

        if( type === 'Main' ){

          var cType = n.data('Type');

          if(
               (cType === 'Creaction' && !creaction)
            || (cType === 'Events' && !events)
            || (cType === 'Wandering' && !wandering)
            || (cType === 'Moving' && !moving)
            || (cType === 'Reflection' && !reflection)
          ){
            filter();
          }

        } else if( type === 'RedWine' ){

          if( !red ){ filter(); }

        } else if( type === 'WhiteWine' ){

          if( !white ){ filter(); }

        } else if( type === 'Cider' ){

          if( !cider ){ filter(); }

        }

      });

    });

  });


});
