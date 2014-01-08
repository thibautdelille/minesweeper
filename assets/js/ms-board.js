/*********************
 * ms-board.js *
 *********************/

(function ($) {

  /* MSBOARD CLASS DEFINITION */

  var MSBoard = function (element, options) {
    this.$element = $(element);
    this.options = options;
    this.init();
  };

  MSBoard.prototype = {

    // Build
    init: function () {
      this._play();
      $('[data-new]').on('click', $.proxy(this._play, this));
      $('[data-cheat]').on('click', $.proxy(this._cheat, this));
      $('[data-verify]').on('click', $.proxy(this._verify, this));
      return this;
    },
    /**
    * Reset the Board at 0
    */
    resetBoard:function(){
      var self = this,i,j, item, line;

      self.options.board = Array();
      self.options.counter = self.options.height*self.options.width;

      $('[data-message]').html("").removeClass('green').removeClass('blue').removeClass('red');
      for(i = 0; i<self.options.height; i++){
        line = [];
        for(j = 0; j<self.options.width; j++){
          item = {
            'i':i,
            'j':j,
            'value':0
          };
          line.push(item);
        }
        self.options.board.push(line);
      }
    },
    removeListener:function(){
      var self = this,i,j, item;

      for(i = 0; i<self.options.board.length; i++){
        for(j = 0; j<self.options.board[i].length; j++){
          item = self.options.board[i][j].element;
          item.off('empty', $.proxy(this.empty, this));
          item.off('toggle', $.proxy(this.toggle, this));
          item.off('boom', $.proxy(this.boom, this));
        }
      }
    },
    /**
    * Increment the value of the case around the mine
    */
    incrementAround:function(_i, _j){
      var self = this;
      for(i = _i-1; i<=_i+1; i++){
        for(j = _j-1; j<=_j+1; j++){
          if((i!==_i)||(j!==_j)){
            if((i>=0)&&(i<self.options.height)&&(j>=0)&&(j<self.options.width)){
              if(self.options.board[i][j].value >= 0){
                self.options.board[i][j].value++;
              }
            }
          }
        }
      }
    },
    /**
    * Set the mines at random position
    */
    setRandomValue:function(){
      var self = this,
      currentMine = 0,
      i, j;
      while(currentMine<self.options.nbmines){
        i = Math.floor(Math.random()*self.options.height);
        j = Math.floor(Math.random()*self.options.width);
        if(self.options.board[i][j].value >= 0){
          self.options.board[i][j].value = -1;
          currentMine++;
          this.incrementAround(i,j);
        }
      }

      for(i = 0; i<self.options.height; i++){
        var line = "";
        for(j = 0; j<self.options.width; j++){
          line += " "+self.options.board[i][j].value;
        }
      }
    },
    /**
    * Create the Dom Elements of the board
    */
    drawBoard: function(){
      var self = this;
      self.$element.html('');
      for(i = 0; i<self.options.height; i++){
        var line = $('<div class="line"></div>');
        self.$element.append(line);
        for(j = 0; j<self.options.width; j++){
          var item = $('<div class="item" data-ms="case"></div>');
          item.mscase(self.options.board[i][j]);
          item.on('toggle', $.proxy(this.toggle, this, self.options.board[i][j]));
          item.on('empty', $.proxy(this.empty, this, self.options.board[i][j]));
          item.on('boom', $.proxy(this.boom, this, self.options.board[i][j]));
          self.options.board[i][j].element = item;
          line.append(item);
        }
      }
    },
    /**
    *
    */
    toggle: function(data){
      var item = data.element,
        self = this;
      item.off('toggle', $.proxy(this.selectItem, this));
      self.options.counter --;
      console.log('self.options.counter:'+self.options.counter);
      if(self.options.counter===self.options.nbmines){
        this.win();
      }
    },
    /**
    *
    */
    empty: function(data){
      var item = data.element;
      item.off('empty', $.proxy(this.selectItem, this));
      this.toggleAround(data.i, data.j);
    },
    /**
    * Increment the value of the case around the mine
    */
    toggleAround:function(_i, _j){
      var self = this,
        i, j;
      for(i = _i-1; i<=_i+1; i++){
        for(j = _j-1; j<=_j+1; j++){
          if((i!==_i)||(j!==_j)){
            if((i>=0)&&(i<self.options.height)&&(j>=0)&&(j<self.options.width)){
              var item = self.options.board[i][j].element;
              if(!item.hasClass('open')){
                item.mscase("toggle");
                if(self.options.board[i][j].value === 0){
                  this.toggleAround(i, j);
                }
              }
            }
          }
        }
      }
    },
    boom:function(data){
      var item = data.element,
      self = this;
      item.off('boom', $.proxy(this.boom, this));

      this.removeListener();

      for(i = 0; i<self.options.height; i++){
        for(j = 0; j<self.options.width; j++){
          item = self.options.board[i][j].element;
          item.mscase("toggle");
        }
      }
      $('[data-message]').html("BOOOOOOMMM !!!").addClass('red');
    },
    win:function(){
      this.addFlags();
      $('[data-message]').html("Congrats, You won !").addClass('green');
    },
    addFlags:function(){
      var self = this;
      for(i = 0; i<self.options.height; i++){
        for(j = 0; j<self.options.width; j++){
          item = self.options.board[i][j].element;
          item.mscase("addflag");
        }
      }
    },
    /**
    * Start a new game
    */
    _play: function() {
      this.removeListener();
      this.resetBoard();
      this.setRandomValue();
      this.drawBoard();
    },
    _cheat: function(){
      var cheatComplete = false,
      self = this;
      if(self.options.counter>self.options.nbmines){
        while(!cheatComplete){
          i = Math.floor(Math.random()*self.options.height);
          j = Math.floor(Math.random()*self.options.width);
          
          item = self.options.board[i][j];

          if(!item.element.hasClass('open')&&(item.value!== -1)){
            item.element.mscase("click");
            cheatComplete = true;
          }
        }
      }
    },
    _verify: function(){
      var self = this,
      nbCases = self.options.height*self.options.width,
      nbEmptyCases = nbCases - self.options.nbmines,
      openCases = nbCases - self.options.counter,
      percent = Math.round(openCases*100/nbEmptyCases);
      this.addFlags();

      $('[data-message]').html("You Achieved "+percent+"% of the board").addClass('blue');
    }
  };

  /* MSBOARD PLUGIN DEFINITION */
  var old = $.fn.msboard;

  $.fn.msboard = function (option) {
    return this.each(function() {
      var data = $(this).data('ms.board'),
          options = $.extend({}, $.fn.msboard.defaults, $(this).data(), typeof option === 'object' && option);
      if (!data) {
        $(this).data('ms.msboard', (data = new MSBoard(this, options)));
      }
      if (typeof option === 'string') {
        data['_'+option]();
      }
    });
  };

  $.fn.msboard.defaults = {
    target: '',
    counter: 0,
    board:[]
  };

  $.fn.msboard.Constructor = MSBoard;

  /* MSBOARD NO CONFLICT */
  $.fn.msboard.noConflict = function () {
    $.fn.msboard = old;
    return this;
  };

  /* MSBOARD ON LOAD */
  $(window).on('load', function (){
    console.log('ready');
    $('[data-ms="board"]').each(function(){
      var options = {
        target : $(this).attr("data-target")
      };
      $(this).msboard(options);
    });

  });
})(window.jQuery);
