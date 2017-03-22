//##############################################################################
// CJSS.js
//##############################################################################

(function (window) {
    
    function CJSS() {
        var _CJSS = {};
        var stage;
        var update;

            /**
	         * Test function to make sure library is working.
	         * @class CJSS
	         * @constructor
	         * @param {String} value
	         **/
        _CJSS.test = function (v) {
            this.value = v.value == null ? "Testing" : v.value;
            alert(this.value);
        }

            /**
             * Library implementation requirement. Many functions in this library will reference the stage object so be sure to call this function before anything else.
             * Update boolean tells CJSS to update the stage every time an object is made or change function is called from the library. This is to give an option
             * to update the scene if you don't have a ticker to do so for you periodically. Default is false.
             * @class CJSS
             * @constructor
             * @param {Stage} stage
             * @param {Boolean} update
             **/
        _CJSS.setStage = function (s) {
            update = s.update == null ? false : s.update;
            if (s.stage) stage = s.stage;
        }

            /**
             * Toggles and returns the update value for determining whether CJSS should update the stage for every object and change function.
             * @class CJSS
             **/
        _CJSS.toggleUpdate = function () {
            update = !update;
            return update;
        }

            /**
             * Creates and draws a simple rectangle shape to the stage. Was used as an initial testing function.
             * @class CJSS
             * @param {Number} xPos
             * @param {Number} yPos
             * @param {Number} width
             * @param {Number} height
             * @param {String} backgroundColor
             * @param {Number} borderStroke
             * @param {String} borderColor
             **/
        _CJSS.createBox = function(b){
            b.xPos = b.xPos == null ? 0 : b.xPos;
            b.yPos = b.yPos == null ? 0 : b.yPos;
            b.width = b.width == null ? 200 : b.width;
            b.height = b.height == null ? 200 : b.height;
            b.backgroundColor = b.backgroundColor == null ? "#fff" : b.backgroundColor;
            b.borderStroke = b.borderStroke == null ? 1 : b.borderStroke;
            b.borderColor = b.borderColor == null ? "#000" : b.borderColor;

            var box = new createjs.Shape().set({x: b.xPos, y: b.yPos});
            box.graphics.setStrokeStyle(b.borderStroke).beginStroke(b.borderColor).beginFill(b.backgroundColor).drawRect(0, 0, b.width, b.height);
            stage.addChild(box);
            if(update) stage.update();
            return box;
        };

            /**
             * Draws a rectangular grid on the stage. Currently uses the CJSS.createBox function to create the shapes.
             * @class CJSS
             * @param {Number} xPos
             * @param {Number} yPos
             * @param {Number} gridWidth
             * @param {Number} gridHeight
             * @param {Number} boxWidth
             * @param {Number} boxHeight
             * @param {String} backgroundColor
             * @param {Number} borderStroke
             * @param {String} borderColor
             **/
        _CJSS.createGrid = function(b){
            b.xPos = b.xPos == null ? 0 : b.xPos;
            b.yPos = b.yPos == null ? 0 : b.yPos;
            b.gridWidth = b.gridWidth == null ? 5 : b.gridWidth;
            b.gridHeight = b.gridHeight == null ? 5 : b.gridHeight;
            b.boxWidth = b.boxWidth == null ? 30 : b.boxWidth;
            b.boxHeight = b.boxHeight == null ? 30 : b.boxHeight;
            b.backgroundColor = b.backgroundColor == null ? "#fff" : b.backgroundColor;
            b.borderStroke = b.borderStroke == null ? 1 : b.borderStroke;
            b.borderColor = b.borderColor == null ? "#000" : b.borderColor;
            
            var grid = new createjs.Container().set({x: b.xPos, y: b.yPos});
            for(var i = 0; i < b.gridWidth; i++){
                for(var j = 0; j < b.gridHeight; j++){
                    var box = _CJSS.createBox({
                        xPos: (b.boxWidth * i),
                        yPos: (b.boxHeight * j),
                        width: b.boxWidth,
                        height: b.boxHeight,
                        backgroundColor: b.backgroundColor,
                        borderStroke: b.borderStroke,
                        borderColor: b.borderColor
                    });
                    grid.addChild(box);
                };
            };
            stage.addChild(grid);
            if (update) stage.update();
            return grid;
        }

            /**
             * Draws a rectangular grid of bitmap images on the stage.
             * @class CJSS
             * @param {Image} image
             * @param {Number} xPos
             * @param {Number} yPos
             * @param {Number} gridWidth
             * @param {Number} gridHeight
             * @param {Number} scaleX
             * @param {Number} scaleY
             **/
        _CJSS.createBitmapGrid = function(b){
            b.xPos = b.xPos == null ? 0 : b.xPos;
            b.yPos = b.yPos == null ? 0 : b.yPos;
            b.gridWidth = b.gridWidth == null ? 5 : b.gridWidth;
            b.gridHeight = b.gridHeight == null ? 5 : b.gridHeight;
            b.scaleX = b.scaleX == null ? 0.5 : b.scaleX;
            b.scaleY = b.scaleY == null ? 0.5 : b.scaleY;

            var grid = new createjs.Container();
            for(var i = 0; i < b.gridWidth; i++){
                for(var j = 0; j < b.gridHeight; j++){
                    var box = new createjs.Bitmap(b.image);
                    var bounds = box.getBounds();
                    box.set({
                        scaleX: b.scaleX,
                        scaleY: b.scaleY,
                        x: i * (bounds.width * b.scaleX),
                        y: j * (bounds.height * b.scaleY)
                    });
                    grid.addChild(box);
                };
            };

            grid.set({x: b.xPos, y: b.yPos});
            stage.addChild(grid);
            if (update) stage.update();
            return grid;
        }

            /**
             * Creates an interactable button. Text will shrink horizontally to fit inside the bounds of the button if sentence is really long.
             * @class CJSS
             * @param {String} text
             * @param {Function} action
             * @param {Number} xPos
             * @param {Number} yPos
             * @param {Number} width
             * @param {Number} height
             * @param {String} backgroundColor
             * @param {Number} borderStroke
             * @param {String} borderColor
             * @param {String} textColor
             * @param {String} textSize
             * @param {String} textFont
             * @param {Number} textOffsetX
             * @param {Number} textOffsety
             **/
        _CJSS.createButton = function (b) {
            b.text = b.text == null ? "Button" : b.text;
            b.action = b.action == null ? function(){alert(b.text + " has been clicked.");} : b.action;
            b.xPos = b.xPos == null ? 0 : b.xPos;
            b.yPos = b.yPos == null ? 0 : b.yPos;
            b.width = b.width == null ? 200 : b.width;
            b.height = b.height == null ? 75 : b.height;
            b.backgroundColor = b.backgroundColor == null ? "#fff" : b.backgroundColor;
            b.borderStroke = b.borderStroke == null ? 1 : b.borderStroke;
            b.borderColor = b.borderColor == null ? "#000" : b.borderColor;
            b.textColor = b.textColor == null ? "#000" : b.textColor;
            b.textSize = b.textSize == null ? "20px" : b.textSize;
            b.textFont = b.textFont == null ? "Arial" : b.textFont;
            b.textOffsetX = b.textOffsetX == null ? 0 : b.textOffsetX;
            b.textOffsetY = b.textOffsetY == null ? 0 : b.textOffsetY;

            var button = new createjs.Container();
            button.name = "container";
            button.set({ x: b.xPos, y: b.yPos, width: b.width, height: b.height });
            button.addEventListener("click", b.action);
            button.addEventListener("click", function(){ button.alpha = 1; stage.update(); });
            button.addEventListener("mousedown", function(){ button.alpha = 0.8; stage.update();})

            var buttonBox = new createjs.Shape();
            buttonBox.name = "box";
            buttonBox.graphics.setStrokeStyle(b.borderStroke).beginStroke(b.borderColor).beginFill(b.backgroundColor).drawRect(0, 0, b.width, b.height);
            button.addChild(buttonBox);
            
            var buttonText = new createjs.Text(b.text, (b.textSize + " " + b.textFont), b.textColor);
            buttonText.name = "text";
            buttonText.maxWidth = b.width - 20;
            buttonText.set({
                x: ((buttonText.getMeasuredWidth() > b.width - 20) ? 10 + b.textOffsetX : (b.width / 2) - (buttonText.getMeasuredWidth() / 2)) + b.textOffsetX,
                y: ((b.height / 2) - (buttonText.getMeasuredHeight() / 2)) + b.textOffsetY
            });
            button.addChild(buttonText);

            /**
             * Returns the button object data.
             * @class button
             **/
            button.getData = function () {
                return b;
            }

            /**
             * Changes button's position and dimensions to parameter values.
             * @class button
             * @param {Number} xPos
             * @param {Number} yPos
             * @param {Number} width
             * @param {Number} height
             **/
            button.changeButton = function (c) {
                if(c.xPos) b.xPos = c.xPos;
                if(c.yPos) b.yPos = c.yPos;
                if(c.width) b.width = c.width;
                if(c.height) b.height = c.height;

                button.set({ x: b.xPos, y: b.yPos, width: b.width, height: b.height });
                button.changeBox({});
                button.changeText({});
                if (update) stage.update();
                return button;
            }

            /**
             * Changes button's box to parameter values.
             * @class button
             * @param {String} backgroundColor
             * @param {String} borderStroke
             * @param {String} borderColor
             **/
            button.changeBox = function (c) {
                button.removeChild(buttonBox);
                if(c.backgroundColor) b.backgroundColor = c.backgroundColor;
                if(c.borderStroke) b.borderStroke = c.borderStroke;
                if(c.borderColor) b.borderColor = c.borderColor;
                
                buttonBox = new createjs.Shape();
                buttonBox.graphics.setStrokeStyle(b.borderStroke).beginStroke(b.borderColor).beginFill(b.backgroundColor).drawRect(0, 0, b.width, b.height);
                button.addChild(buttonBox);
                if (update) stage.update();
                return button;
            }

            /**
             * Changes button's text to parameter values.
             * @class button
             * @param {String} text
             * @param {String} textColor
             * @param {String} textSize
             * @param {String} textFont
             * @param {Number} textOffsetX
             * @param {Number} textOffsetY
             **/
            button.changeText = function (c) {
                button.removeChild(buttonText);

                if(c.text) b.text = c.text;
                if(c.textColor) b.textColor = c.textColor;
                if(c.textSize) b.textSize = c.textSize;
                if (c.textFont) b.textFont = c.textFont;
                if (c.textOffsetX) b.textOffsetX = c.textOffsetX; 
                if (c.textOffsetY) b.textOffsetY = c.textOffsetY;
                

                buttonText = new createjs.Text(b.text, (b.textSize + " " + b.textFont), b.textColor);
                buttonText.maxWidth = b.width - 20;
                buttonText.set({
                    x: ((buttonText.getMeasuredWidth() > b.width - 20) ? 10 + b.textOffsetX : (b.width / 2) - (buttonText.getMeasuredWidth() / 2)) + b.textOffsetX,
                    y: ((b.height / 2) - (buttonText.getMeasuredHeight() / 2)) + b.textOffsetY
                });
                button.addChild(buttonText);
                if (update) stage.update();
                return button;
            }

            /**
             * Changes button's action to parameter action.
             * @class button
             * @param {Function} action
             **/
            button.changeAction = function(action){
                button.removeEventListener("click", b.action);
                b.action = action;
                button.addEventListener("click", b.action);
                if (update) stage.update();
                return button;
            }

            stage.addChild(button);
            if (update) stage.update();
            return button;
        }

            /**
             * Creates a button drop down menu. Uses button objects for the main and sub buttons. The down boolean can be set to true to display the sub-buttons 
             * downwards or to false to display the sub-buttons upwards. Default is true.
             * @class CJSS
             * @param {Button} mainButton
             * @param {Array} subButtons [{Button}]
             * @param {Number} xPos
             * @param {Number} yPos
             * @param {Boolean} down
             **/
        _CJSS.createDropButton = function (b) {
            b.xPos = b.xPos == null ? 0 : b.xPos;
            b.yPos = b.yPos == null ? 0 : b.yPos;
            b.mainButton = b.mainButton == null ? _CJSS.createButton({text: "MainButton"}) : b.mainButton;
            b.subButtons = b.subButtons == null ? [_CJSS.createButton({ text: "SubButton1" }), _CJSS.createButton({text: "SubButton2"})] : b.subButtons;
            b.down = b.down == null ? true : b.down;

            var dropList = new createjs.Container();
            var mainButton = b.mainButton.changeAction(toggleDropButtons);
            dropList.addChild(mainButton);
                    
            for (var i = 0; i < b.subButtons.length; i++) {
                var buttonData = b.subButtons[i].getData();
                var direction = b.down ? i + 1 : -(i + 1);
                b.subButtons[i].changeButton({ yPos: buttonData.yPos + (buttonData.height * direction) });
                dropList.addChild(b.subButtons[i]);
            }
                    
            function toggleDropButtons(){
                for(var i = 1; i < dropList.numChildren; i++)
                    dropList.getChildAt(i).visible = !dropList.getChildAt(i).visible;
            }
            toggleDropButtons();

            dropList.set({x: b.xPos, y: b.yPos});
            stage.addChild(dropList);
            if (update) stage.update();
            return dropList;
        }

        _CJSS.createDropMenu = function(b){
            
        }

            /**
             * Creates a chargeBar that has the innerBar fill or drain using percentages. The emptyBar boolean determines whether it should be empty upon creation.
             * Default value is false.
             * @class CJSS
             * @param {Boolean} emptyBar
             * @param {Number} xPos
             * @param {Number} yPos
             * @param {Boolean} down
             **/
        _CJSS.createChargeBar = function (b) {
            b.emptyBar = b.emptyBar == null ? false : b.emptyBar;
            b.xPos = b.xPos == null ? 15 : b.xPos;
            b.yPos = b.yPos == null ? 15 : b.yPos;
            b.width = b.width == null ? 500 : b.width;
            b.height = b.height == null ? 50 : b.height;
            b.barColor = b.barColor == null ? "#0c0" : b.barColor;
            b.borderStroke = b.borderStroke == null ? 15 : b.borderStroke;
            b.borderColor = b.borderColor == null ? "#fff" : b.borderColor;
            b.chargePercent = b.chargePercent == null ? (b.emptyBar ? 0 : 100) : b.chargePercent;
            
            var chargeInBounds = function (amount) {
                if (amount > 100)
                    return 100;
                if (amount < 0)
                    return 0;
                
                return amount;
            }
            b.chargePercent = chargeInBounds(b.chargePercent);


            var chargeToValue = function (percent) {
                return b.width * (percent / 100);
            }
            
            var chargeBar = new createjs.Container();
            chargeBar.set({ x: b.xPos, y: b.yPos });

            var innerBar = new createjs.Shape();
            innerBar.name = "innerBar";
            var adjustInner = innerBar.graphics.beginFill(b.barColor).drawRect(0, 0, chargeToValue(b.chargePercent), b.height).command;
            chargeBar.addChild(innerBar);

            var outerBar = new createjs.Shape();
            outerBar.graphics.setStrokeStyle(b.borderStroke).beginStroke(b.borderColor).drawRect(0, 0, b.width, b.height);
            chargeBar.addChild(outerBar);

            var redraw = false;

            /**
             * Increase the percentage of the chargeBar by the given percent value. Value should be from 0-100.
             * @class chargeBar
             * @param {Number} increase
             **/
            chargeBar.increaseBar = function (increase) {
                var newPercent = b.chargePercent + chargeInBounds(increase);
                if (newPercent >= 100) {
                    b.chargePercent = 100;
                } else {
                    b.chargePercent = newPercent;
                    redraw = true;
                }
                if (redraw) {
                    var inner = chargeBar.getChildByName("innerBar");
                    inner.graphics.clear();
                    inner.graphics.beginFill(b.barColor).drawRect(0, 0, chargeToValue(b.chargePercent), b.height);
                }
                if (b.chargePercent == 100) {
                    redraw = false;
                }

                if (update) stage.update();
                return chargeBar;
            }

            /**
             * Decrease the percentage of the chargeBar by the given percent value. Value should be from 0-100.
             * @class chargeBar
             * @param {Number} decrease
             **/
            chargeBar.decreaseBar = function (decrease) {
                var newPercent = b.chargePercent - chargeInBounds(decrease);
                if (newPercent <= 0) {
                    b.chargePercent = 0;
                } else {
                    b.chargePercent = newPercent;
                    redraw = true;
                }
                if (redraw) {
                    var inner = chargeBar.getChildByName("innerBar");
                    inner.graphics.clear();
                    inner.graphics.beginFill(b.barColor).drawRect(0, 0, chargeToValue(b.chargePercent), b.height);
                }
                if (b.chargePercent == 0) {
                    redraw = false;
                }
                if (update) stage.update();
                return chargeBar;
            }

            /**
             * Returns the current percentage of the chargeBar.
             * @class chargeBar
             **/
            chargeBar.getChargePercent = function () {
                return b.chargePercent;
            }

            /**
             * Set the percentage of the chargeBar by the given percent value. Value should be from 0-100.
             * @class chargeBar
             * @param {Number} percent
             **/
            chargeBar.setChargePercent = function (percent) {
                b.chargePercent = chargeInBounds(percent);
                var inner = chargeBar.getChildByName("innerBar");
                inner.graphics.clear();
                inner.graphics.beginFill(b.barColor).drawRect(0, 0, chargeToValue(b.chargePercent), b.height);
                if (update) stage.update();
                return chargeBar;
            }

            //Work In Progress
            /*
            chargeBar.shiftBarTo = function (percent, speed, loop) {
                b.chargePercent = chargeInBounds(percent);
                createjs.Tween.get(adjustInner, { loop: loop }).to({ w: chargeToValue(b.chargePercent) }, speed, createjs.Ease.quadInOut);
                if (update) stage.update();
                return chargeBar;
            }
            */

            stage.addChild(chargeBar);
            if (update) stage.update();
            return chargeBar;
        }

        return _CJSS;
    }

    if (typeof (window.CJSS) === 'undefined') {
        window.CJSS = CJSS();
    }
})(window);
