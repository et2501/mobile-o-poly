/**
 * Copyright (c) 2013 Aleksandar Palic
 * Released under MIT license 
 * Find me on Twitter: @_skripted
 * Version: 1.2
 */

var Dice = Dice || (function () {

    // main properties
    var _dices = [],
        _buildingNum = 0,
        _ignore = 0,
        _args = {
            animate : true,
            debug : false, 
            diceFaces : 6,
            diceSize: 200,
            diceCls : { 
                box : 'diceBox', 
                cube : 'diceCube',
                face : 'face',
                side : 'side'
            },
            wrapper : 'body',
            xRange : [8, 16],
            yRange : [8, 16],
            cssProp : 'transform:-webkit-transform:-moz-transform:OTransform:msTransform'
        },
        _animationPrepared = false,
        _diceNumber,
        _cssProp;

    /**
     * @method fnDebug
     * @param {String, AnyType} txt, val
     */
    function fnDebug (txt, val) {
        if(_args.debug) console.log(txt + ': ' + val);
    }

    /**
     * @method fnCreateElement
     * @param {String, String, String} type, id, cName
     * @return {DOM Element} el
     */
    function fnCreateElement (type, id, cName) {
        var el = document.createElement(type);
        if(id != undefined) el.id = id;
        if(cName != undefined) el.className = cName;
        return el;
    }

    /**
     * @method overrideArgs
     * @param {Object} args
     */
    function overrideArgs (args) {
        for (var key in args) {
            for(var key2 in _args) {
                if(key == key2)
                    _args[key] = args[key];
            }
        }
    }

    /**
     * @method getDiceNumber
     * @return {Number} dNum
     */
    function getDiceNumber () {
        var dNum = (_buildingNum < _args.diceFaces ? 1 : Math.ceil(_buildingNum / _args.diceFaces));
        fnDebug('Dice Number', dNum);
        return dNum;
    }

    /**
     * @method getDiceTurns
     * @return {Array}
     */
    function getDiceTurns () {
        var xTurns = getRandomNumber(_args.xRange[0], _args.xRange[1]),
            yTurns = getRandomNumber(_args.yRange[0], _args.yRange[1]);

        fnDebug('X-Turns and Y-Turns', Array(xTurns, yTurns));
        return Array(xTurns, yTurns);
    }

    /**
     * @method getDiceResult
     * @param {Number, Number} xTurns, Y-Turns
     * @return {Number} result
     */
    function getDiceResult (xTurns, yTurns) {
        // assuming a 6-faced dice - work in progress
        var xIndex = [3, 6, 4, 1],
            yIndex = [[3, 5, 4, 2], [4, 2, 3, 5]],
            modX = xTurns % 4, modY = yTurns % 4,
            result;

        if(modX == 1) result = xIndex[modX];
        else if(modX == 3) result = xIndex[modX];
        else {
            if(modX == 0) result = yIndex[0][modY]
            if(modX == 2) result = yIndex[1][modY];
        }
        fnDebug('Result for Dice', result);
        return result;
    }

    /**
     * @method getBrowserCSSProp
     * @return {String} props[i]
     */
    function getBrowserCSSProp () {
        var props = _args.cssProp.split(':'),
            el = document.createElement('div');

        for(var i = 0, l = props.length; i < l; i++) {
            if(typeof el.style[props[i]] !== "undefined") {
                fnDebug('Found CSS Property', props[i]);
                return props[i];
            }
        }
    }

    /**
     * @method getRandomNumber
     * @param {Number, Number} min, max
     * @return {Number} num
     */
    function getRandomNumber (min, max) {
        var num = Math.floor(Math.random() * (max - min + 1)) + min;
        fnDebug('Random Twist Number Generated', num);
        return num;
    }

    /**
     * @method createDiceElements
     */
    function createDiceElements () {
        var wrapper = document.getElementById(_args.wrapper) || document.body,
            mainResult = 0, 
            diceBox, 
            diceCube, 
            diceTurns, 
            diceResult;

        for (var i = 0; i < _diceNumber; i ++) {
            diceBox = fnCreateElement('div', 'dice_' + i, _args.diceCls.box);
            renderBoxWithCSS(diceBox);

            diceCube = fnCreateElement('div', 'cube_' + i, _args.diceCls.cube);
            renderCubeWithCSS(diceCube);

            for(var j = 0; j < _args.diceFaces; j ++) {
                diceFace = fnCreateElement('div', undefined, _args.diceCls.face + ' ' + _args.diceCls.side + (j + 1));
                renderFaceWithCSS(diceFace);
                
                diceCube.appendChild(diceFace);
            }

            renderFacesWithCSS(diceCube);
            
            diceTurns = getDiceTurns();
            diceResult = getDiceResult(diceTurns[0], diceTurns[1]);
            mainResult += diceResult;

            while(i == (_diceNumber - 1) && mainResult == _ignore) {
                mainResult -= diceResult;
                diceTurns = getDiceTurns();
                diceResult = getDiceResult(diceTurns[0], diceTurns[1]);
                mainResult += diceResult;
            }

            _dices.push({ div : diceCube, turns : diceTurns, result : diceResult });

            diceBox.appendChild(diceCube);
            wrapper.appendChild(diceBox);
        }
    }
    
    /**
     * @method renderBoxWithCSS
     * @param {Element} diceBox
     */
    function renderBoxWithCSS (diceBox) {
        diceBox.style['-webkit-perspective'] = _args.diceSize / 2 * 3;
        diceBox.style['-moz-perspective'] = _args.diceSize / 2 * 3;
        diceBox.style['-webkit-perspective-origin'] = '50%' + _args.diceSize / 2 + 'px';
        diceBox.style['-moz-perspective-origin'] = '50%' + _args.diceSize / 2 + 'px';
        diceBox.style['width'] = _args.diceSize + 'px';
        diceBox.style['height'] = _args.diceSize + 'px';
    }

    /**
     * @method renderCubeWithCSS
     * @param {Element} diceCube
     */
    function renderCubeWithCSS (diceCube) {
        diceCube.style['width'] = _args.diceSize / 2 + 'px';
        diceCube.style['height'] = _args.diceSize / 2 + 'px';
        diceCube.style['margin'] = _args.diceSize / 2 / 2 + 'px auto';
    }

    /**
     * @method renderFaceWithCSS
     * @param {Element} diceFace
     */
    function renderFaceWithCSS (diceFace) {
        diceFace.style['width'] = _args.diceSize / 2 + 'px';
        diceFace.style['height'] = _args.diceSize / 2 + 'px';
    }

    /**
     * @method renderFacesWithCSS
     * @param {Element} diceCube
     */
    function renderFacesWithCSS (diceCube) {
        diceCube.childNodes[0].style[_cssProp] = 'rotateX(90deg) translateZ(' + _args.diceSize / 4 + 'px)';
        diceCube.childNodes[1].style[_cssProp] = 'translateZ(' + _args.diceSize / 4 + 'px)';
        diceCube.childNodes[2].style[_cssProp] = 'rotateY(90deg) translateZ(' + _args.diceSize / 4 + 'px)';
        diceCube.childNodes[3].style[_cssProp] = 'rotateY(180deg) translateZ(' + _args.diceSize / 4 + 'px)';
        diceCube.childNodes[4].style[_cssProp] = 'rotateY(-90deg) translateZ(' + _args.diceSize / 4 + 'px)';
        diceCube.childNodes[5].style[_cssProp] = 'rotateX(-90deg) rotate(180deg) translateZ(' + _args.diceSize / 4 + 'px)';
    }

    /**
     * @method animateDiceElements
     */
    function animateDiceElements (callback) {
        for (var dice in _dices) {
            _dices[dice].div.style[_cssProp] = 'rotateX(' + _dices[dice].turns[0] * 90 + 'deg) ' + 
                ' rotateY(' + _dices[dice].turns[1] * 90 + 'deg)';
        }
        if (callback) callback();
    }

    /**
     * @method getAnimatedResult
     * @return {Number} result
     */
    function getAnimatedResult () {
        var result = 0;

        for (var dice in _dices) {
            result += _dices[dice].result;
        }
        fnDebug('Result for all Dices', result);
        return result;
    }

    /**
     * @method fnCreateElement
     * @return {Number} result
     */
    function getDefaultResult () {
        var result = _ignore;
        while(result == _ignore) {
            result = getRandomNumber(_diceNumber * 1, _diceNumber * _args.diceFaces);
        }
        fnDebug('Result for all Dices', result);
        return result;
    }

    /**
     * @method startEngine
     * @return {Number} result
     */
    function startEngine () {
        var result = _ignore;

        if (_args.animate) {
            createDiceElements();
            _animationPrepared = true;
            result = getAnimatedResult();
        }
        else result = getDefaultResult();

        return result;
    }

    // public functions
    return {
        /**
         * @method init
         * @param {Number, Number, Object} buildingNum, ignore, args
         * @return {Function} startEngine()
         */
        init : function (buildingNum, ignore, args) {
            // construct attributes
            _buildingNum = buildingNum;
            _ignore = ignore;

            // override arguments
            if (typeof(args) === 'object')
                overrideArgs(args);

            _diceNumber = getDiceNumber();
            _cssProp = getBrowserCSSProp();

            return startEngine();
        },
        /**
         * @method animate
         */
        animate : function (callback) {
            if(_animationPrepared) animateDiceElements(callback);
        }
    }

}());
