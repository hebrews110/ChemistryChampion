/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* Add instructions */

/* Calculator thing: https://upload.wikimedia.org/wikipedia/commons/7/7e/Calcman.png */


var currentEquation;
var originalEquation;


var leftWeight = 0, rightWeight = 0;
var realX = 0;

var isBalanced = false;

var eqString = "";

var targetAngle = 0;
var movementAngle = 10;
var mathObjHeight = 25;

var $animationObject;

var barAngle = 0;

var leftSubDivide = 4;
var rightSubDivide = 1;

var correctLeft = 4;

var leftPrefix = "Sn";
var rightPrefix = "F";

/* Patch in Math.sign for unsupported browsers */

if (!Math.sign) {
  Math.sign = function(x) {
    // If x is NaN, the result is NaN.
    // If x is -0, the result is -0.
    // If x is +0, the result is +0.
    // If x is negative and not -0, the result is -1.
    // If x is positive and not +0, the result is +1.
    return ((x > 0) - (x < 0)) || +x;
    // A more aesthetical persuado-representation is shown below
    //
    // ( (x > 0) ? 0 : 1 )  // if x is negative then negative one
    //          +           // else (because you cant be both - and +)
    // ( (x < 0) ? 0 : -1 ) // if x is positive then positive one
    //         ||           // if x is 0, -0, or NaN, or not a number,
    //         +x           // Then the result will be x, (or) if x is
    //                      // not a number, then x converts to number
  };
}



function PosIon(name, symbol, num) {
    this.name = name;
    this.symbol = symbol;
    this.num = parseInt(num);
}


function NegIon(name, symbol, num) {
    this.name = name;
    this.symbol = symbol;
    this.num = -parseInt(num);
}

/* Based in part on http://www.chemfiles.com/flash/formulas.swf */
var positive_ions = new Array();
var negative_ions = new Array();
positive_ions[0] = new PosIon("lithium","Li","1");
positive_ions[1] = new PosIon("sodium","Na","1");
positive_ions[2] = new PosIon("potassium","K","1");
positive_ions[3] = new PosIon("rubidium","Rb","1");
positive_ions[4] = new PosIon("cesium","Cs","1");
positive_ions[5] = new PosIon("copper (I)","Cu","1");
positive_ions[6] = new PosIon("cuprous","Cu","1");
positive_ions[7] = new PosIon("silver","Ag","1");
positive_ions[8] = new PosIon("calcium","Ca","2");
positive_ions[9] = new PosIon("magnesium","Mg","2");
positive_ions[10] = new PosIon("barium","Ba","2");
positive_ions[11] = new PosIon("strontium","Sr","2");
positive_ions[12] = new PosIon("ferrous","Fe","2");
positive_ions[13] = new PosIon("iron (II)","Fe","2");
positive_ions[14] = new PosIon("tin (II)","Sn","2");
positive_ions[15] = new PosIon("stannous","Sn","2");
positive_ions[16] = new PosIon("lead (II)","Pb","2");
positive_ions[17] = new PosIon("plumbous","Pb","2");
positive_ions[18] = new PosIon("zinc","Zn","2");
positive_ions[19] = new PosIon("aluminum","Al","3");
positive_ions[20] = new PosIon("iron (III)","Fe","3");
positive_ions[21] = new PosIon("ferric","Fe","3");
positive_ions[22] = new PosIon("tin (IV)","Sn","4");
positive_ions[23] = new PosIon("stannic","Sn","4");
positive_ions[24] = new PosIon("lead (IV)","Pb","4");
positive_ions[25] = new PosIon("plumbic","Pb","4");
negative_ions[0] = new NegIon("phosphide","P","3");
negative_ions[1] = new NegIon("nitride","N","3");
negative_ions[2] = new NegIon("oxide","O","2");
negative_ions[3] = new NegIon("sulfide","S","2");
negative_ions[4] = new NegIon("selenide","Se","2");
negative_ions[5] = new NegIon("telluride","Te","2");
negative_ions[6] = new NegIon("fluoride","F","1");
negative_ions[7] = new NegIon("chloride","Cl","1");
negative_ions[8] = new NegIon("bromide","Br","1");
negative_ions[9] = new NegIon("iodide","I","1");
negative_ions[10] = new NegIon("hydride","H","1");

Number.isInteger = Number.isInteger || function(value) {
  return typeof value === 'number' && 
    isFinite(value) && 
    Math.floor(value) === value;
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEquation() {

}

function updateBalance() {
    console.log("Left hand: " + leftWeight.toString());
    console.log("Right hand: " + rightWeight.toString());
    $("#shelf-eq-left").text(leftWeight.toString());
    $("#shelf-eq-right").text(rightWeight.toString());
    var dif = rightWeight + leftWeight;

    var dif_int = dif;
    console.log("Difference: " + dif_int);
    var $rightShelf = $($(".weight-div")[1]);
    var $leftShelf = $($(".weight-div")[0]);
    if(dif_int < 0)
    {
        console.log("Right shelf is lower");
        goToAngle(movementAngle);
        isBalanced = false;
    } else if(dif_int > 0) {
        console.log("Left shelf is lower");
        goToAngle(-movementAngle);
        isBalanced = false;
    } else {
        console.log("Equivalent");
        goToAngle(0, function() {
            if((leftWeight+rightWeight) == 0 && leftWeight > 0 && rightWeight < 0) {
                $("#finished-dialog").dialog();
            }
        });
        isBalanced = true;
    }

    $(".math-obj-on-shelf").off('click').click(function() {
        console.log("A CLICK EVENT");
        var expr = parseInt($(this).children('.math-obj-val').text());
        console.log(expr);
        if($(this).parent().parent().parent().attr("id") === "left-balance-div") {
            leftWeight = leftWeight - expr;
            resync(leftWeight, $(this).parent());
        } else {
            rightWeight = rightWeight - expr;
            resync(rightWeight, $(this).parent());
        }
        $(this).remove();
        updateBalance();
    });
}

function doPrefix(n) {
    n = (n<0?"":"+") + n;
    return n;
}

function resync(expression, $shelfside) {
    $shelfside.empty();
    var id = $shelfside.attr("id");
    var subDivide = (id == "balance-items-left") ? leftSubDivide : rightSubDivide;

    var numItems = Math.abs(expression / subDivide);
    console.log(numItems, id);
    for(var i = 0; i < numItems; i++) {
        var n = subDivide * Math.sign(expression);
        n = doPrefix(n);
        var newEl = document.createElement("div");
        newEl.classList.add("math-obj");
        newEl.classList.add("math-obj-on-shelf");
        var prefix = (id == "balance-items-left") ? leftPrefix : rightPrefix;
         
        $(newEl).html(prefix + "<span class='math-obj-val'>" + n + "</span>");
        $shelfside.append(newEl);
    }

    var newEl = document.createElement("div");
    newEl.classList.add("math-balance-side-val");
    $(newEl).text(doPrefix((id == "balance-items-left") ? leftWeight : rightWeight));
    $shelfside.append(newEl);

    newEl = document.createElement("div");
    newEl.classList.add("math-balance-side-name");
    $(newEl).text((id == "balance-items-left") ? "Positive" : "Negative");
    $shelfside.append(newEl);
}

function showEquationDialog(show) {
    if(show === undefined || show) {
        $("#blocks-screen").hide();
        $("#equation-simplify-screen").show();
    } else {
        $("#equation-simplify-screen").hide();
        $("#blocks-screen").show();
    }
}

function reposition($this) {
    for(var i = 2; i < $this.children().length; i++) {
        var $el = $($this.children()[i]);
        $el.css({ bottom: 'calc(32px + ' + (mathObjHeight*(i-2)) + 'px)' });
    }
}
function gcd2(a, b) {
    // Greatest common divisor of 2 integers
    if(!b) return b===0 ? a : NaN;
    return gcd2(b, a%b);
}
function gcd(array) {
    // Greatest common divisor of a list of integers
    var n = 0;
    for(var i=0; i<array.length; ++i)
        n = gcd2(array[i], n);
    return n;
}
function lcm2(a, b) {
    // Least common multiple of 2 integers
    return a*b / gcd2(a, b);
}

function nextEquation() {
    leftWeight = 0;
    rightWeight = 0;
    $(".balance-items").empty();
    resync(0, $("#balance-items-left"));
    resync(0, $("#balance-items-right"));
    try { $("#finished-dialog").dialog('close'); } catch (e) {}
    originalEquation = currentEquation = generateEquation();

    var pion = positive_ions[getRandomInt(0, positive_ions.length-1)];
    var nion = negative_ions[getRandomInt(0, negative_ions.length-1)];


    $("#matches").text("What is the formula for " + pion.name + " " + nion.name + "?");
    leftPrefix = pion.symbol;
    rightPrefix = nion.symbol;

    leftSubDivide = pion.num;
    rightSubDivide = -nion.num;

    correctLeft = lcm2(pion.num, -nion.num);

    console.log("Correct left is " + correctLeft);

    //updateEquation();
    var $leftMathObj = $('.math-obj:not(.math-obj-negative)');
    var $rightMathObj = $('.math-obj-negative');
    $leftMathObj[0].childNodes[0].nodeValue = leftPrefix;
    $rightMathObj[0].childNodes[0].nodeValue = rightPrefix;
    $leftMathObj.children('.math-obj-val').text(doPrefix(leftSubDivide));
    $rightMathObj.children('.math-obj-val').text(doPrefix(-rightSubDivide));
    
    updateBalance();
}

$(function() {
    const pretty = document.getElementById('pretty');
    
    

   
    $("input[type='radio']").checkboxradio( { icon: false });
    $("input[type='radio']").click(function() {
        var phrase = $(this).attr("data-phrase");
        $("#operation-name").text(phrase);
    });
    $("#operation-execute").click(function() {
        var $radio = $('input[name=math-things]:checked');
        var $r_id =  $radio.attr("id");
        
        var char = $("label[for=" + $r_id + "]").text();
        var val = $("#add-value").val();
        var expr;
        
        try { expr = algebra.parse(val); } catch (e) { return; };
        
        
        if(expr instanceof Equation)
            return;
        
        expr = expr.simplify();
        
        console.log(char);
        console.log(expr);
        $("#error-msg").text("");
        switch(char) {
            case '\u002B':
                currentEquation = currentEquation.add(expr);
                break;
            case '\u00D7':
                currentEquation = currentEquation.multiply(expr);
                break;
            case '\u2212':
                currentEquation = currentEquation.subtract(expr);
                break;
            case '\u00F7':
                /* Division is handled poorly by the library */
                if(expr.terms.length === 0 && expr.constants.length === 1) {
                    /* Convert it to a fraction */
                    currentEquation = currentEquation.multiply(expr.constants[0].invert());
                } else
                    $("#error-msg").text("Dividing by a variable is not necessary.");
                
                break;
            default:
                return;
        }
        
        if($("#error-msg").text() === "") {
            updateEquation(true);
        }
    }); 
    $("#add-button").click();
    
    //$("#equation-dialog").dialog({ modal: true, dialogClass: 'noTitleStuff', width: 'auto', height: 'auto' });
    //showEquationDialog();
    $(".math-obj:not(.math-obj-on-shelf)").draggable({ revert: "invalid", helper: "clone", zIndex: 20 });
    $(".balance-items").droppable({
        accept: function(el) {
            if(!$(el).is(".math-obj:not(.math-obj-on-shelf)"))
                return false;
            var expr = parseInt($(el).children('.math-obj-val').text());
            if($(this).attr("id") == "balance-items-left" && expr < 0)
                return false;
            else if($(this).attr("id") == "balance-items-right" && expr > 0)
                return false;
            return true;
        },
        drop: function(event, ui) {
            var expr = parseInt($(ui.helper).children('.math-obj-val').text());
            
            if($(this).parent().parent().attr("id") === "left-balance-div") {
                leftWeight = leftWeight + expr;
                resync(leftWeight, $(this));
            } else {
                rightWeight = rightWeight + expr;
                resync(rightWeight, $(this));
            }
            /*
            var $newEl = $(ui.helper).clone().removeClass('ui-draggable');
            $newEl.removeClass('ui-draggable-dragging');
            $newEl.removeClass('ui-draggable-handle');
            $newEl.css({ position: '', top: '', left: '' });
            $newEl.addClass('math-obj-on-shelf');
            $(this).append($newEl); */
            updateBalance();
        }
    });
    nextEquation();
    $("#instructions-dialog").dialog({ modal: true });
    showEquationDialog(false);
});

function dtor(angle) {
    return angle * (Math.PI/180);
}

function goToAngle(angle, complete) {
    if(angle === barAngle) {
        if($animationObject !== undefined)
            $animationObject.stop();
        return;
    } else if(angle === targetAngle) {
        return;
    }
    targetAngle = angle;
    $animationObject = $({ n: barAngle }).animate({ n: angle }, {
        duration: 2000,
        complete: complete,
        step: function(now, fx) {
            barAngle = now;
        }
    });
};

/* P5.JS */

const s = function( p ) {
  var strokeThickness = 5;
  var w, h;
  
  var yPos;
  
  var balanceRadius;
    function checkForChanges()
    {
        var $element = $("#shelf-canvas");
        if ($element.height() !== h || $element.width !== w)
        {
            resizedThing();
        }
        setTimeout(checkForChanges, 100);
    }
  var resizedThing = function() {
    w = $("#shelf-canvas").width();
    h = $("#shelf-canvas").height();
    yPos = h - (h / 10);
    balanceRadius = w / 4;
    p.resizeCanvas(w, h);
  };
  p.setup = function() {
    p.createCanvas($("#shelf-canvas").width(), $("#shelf-canvas").height());
    goToAngle(0);
    checkForChanges();
  };

  p.draw = function() {
    p.background('rgba(0, 0, 0, 0)');
    p.fill(0);
    p.strokeWeight(strokeThickness);
    p.line(w / 2, yPos, w / 2, h - 10);
    p.ellipse(w / 2, h, 30, 15);
    p.noFill();
    
    /* First draw the right half of the bar */
    
    /* Use trig to calculate the end points */
    var endX_r = (w / 2) + Math.cos(dtor(barAngle))*balanceRadius;
    var endY_r = (yPos) + Math.sin(dtor(barAngle))*balanceRadius;
    /* P5.JS has a reversed Y setup compared to Cartesian plane */
    p.line(w / 2, yPos, endX_r, endY_r);
    $("#right-balance-div").css({ top: endY_r, left: endX_r });
    
    /* Now repeat for the other half */
    
    /* Use trig to calculate the end points */
    var endX_l = (w / 2) - Math.cos(dtor(barAngle))*balanceRadius;
    var endY_l = (yPos) - Math.sin(dtor(barAngle))*balanceRadius;
    /* P5.JS has a reversed Y setup compared to Cartesian plane */
    p.line(w / 2, yPos, endX_l, endY_l);
    $("#left-balance-div").css({ top: endY_l, left: endX_l });
    
  };
};

var myp5 = new p5(s, 'shelf-canvas');


function measureText(pText, pFontSize, pFamily, pWeight) {
    var lDiv = document.createElement('div');

    document.body.appendChild(lDiv);
  
    if (pFamily != null) {
        lDiv.style.fontFamily = pFamily;
    }
    if (pWeight != null) {
        lDiv.style.fontWeight = pWeight;
    }
    lDiv.style.fontSize = "" + pFontSize + "px";
    lDiv.style.position = "absolute";
    lDiv.style.left = -1000;
    lDiv.style.top = -1000;
 
    lDiv.innerHTML = pText;

    var lResult = {
        width: lDiv.clientWidth,
        height: lDiv.clientHeight
    };

    document.body.removeChild(lDiv);
    lDiv = null;

  return lResult;
}
 