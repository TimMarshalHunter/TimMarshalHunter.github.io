var preload;
function load() {
    preload = new createjs.LoadQueue();
    preload.addEventListener("complete", run);
    preload.loadManifest([
        { id: "Brick", src: "/Brick_Block.png" }
    ]);
    preload.load();
}



function run() {
    var s = new createjs.Stage("canvas");
    CJSS.setStage({ stage: s, update: true });
    //CJSS.test({value: "Nothing"});

    //*************
    // Box Example
    //*************

    //CJSS.createBox({width: 500});


    //*****************
    // BoxGrid Example
    //*****************

    //CJSS.createGrid({gridWidth: 10});


    //********************
    // BitmapGrid Example
    //********************

    //var image = preload.getResult("Brick");
    //CJSS.createBitmapGrid({ image: image, xPos: 100, yPos: 100, gridWidth: 9, gridHeight: 3, scaleX: 0.05, scaleY: 0.05 });


    //****************
    // Button Example
    //****************

    /*var button = CJSS.createButton({
        text: "Something Really Really Really Really Long Example",
        xPos: 400,
        yPos: 400
    });*/
    
    /*var button2 = CJSS.createButton({
        action: function () { alert("Thanks for trying this example!") },
        text: "Customization Example",
        textColor: "orange",
        textSize: "40px",
        textFont: "Courier",
        textOffsetX: 20,
        textOffsetY: -30,
        xPos: 500,
        yPos: 300,
        width: 300,
        height: 100,
        backgroundColor: "lightblue",
        borderStroke: 8,
        borderColor: "green"
    });*/

    //Button Change Function Examples
    //button.changeText({ text: "New Text", textColor: "red", textFont: "Impact", textSize: "50px", textOffsetY: -10 });
    //button.changeBox({ backgroundColor: "blue", borderColor: "white", borderStroke: 5 });
    //button.changeButton({ xPos: 300, yPos: 300, width: 400, height: 150 });
    //button.changeAction( function () { alert("Does the new thing.") });

    //Also are chainable
    //button.changeText({text: "Another New Text"}).changeAction(function () { alert("Here's the latest stuff.") });


    //********************
    // DropButton Example
    //********************

    //CJSS.createDropButton({ mainButton: CJSS.createButton({text: "Generic Values Example"}), xPos: 100, yPos: 200});
    /*CJSS.createDropButton({
        mainButton: CJSS.createButton({text: "Custom Values Example"}),
        subButtons: [
            CJSS.createButton({ text: "SubMenu1", backgroundColor: "#666", width: 100 }),
            CJSS.createButton({ text: "SubMenu2", backgroundColor: "grey", width: 100, xPos: 100, yPos: 75 }),
            CJSS.createButton({ text: "SubMenu3", backgroundColor: "rgba(100, 100, 100, 0.5)", yPos: 75 })
        ],
        xPos: 200,
        yPos: 500,
        down: false
    });*/


    //*******************
    // ChargeBar Example
    //*******************

    //Default and set function example.
    //var chargeBar = CJSS.createChargeBar({});
    //chargeBar.setChargePercent(20);

    //Adjusting chargebar example.
    /*
    createjs.Ticker.setFPS(20);
    createjs.Ticker.addEventListener("tick", chargeTick);
    var chargeBar = CJSS.createChargeBar({ chargePercent: 50, emptyBar: false });
    var fill = true;

    function chargeTick() {
        if (chargeBar.getChargePercent() == 0)
            fill = true;
        if (chargeBar.getChargePercent() == 100)
            fill = false;

        fill ? chargeBar.increaseBar(2) : chargeBar.decreaseBar(2);
    }
    */
}