var Physics = window.Physics = function(element,elementThree,aContext,myWords,scale) {
    var gravity = new b2Vec2(0,4.8);
    this.world = new b2World(gravity, true);
    this.element = element;
   // this.elementTwo = elementTwo;
    this.elementThree = elementThree;
    this.myWords = myWords;
    
    this.context = element.getContext("2d");
   // this.contextTwo = elementTwo.getContext("2d");
    this.contextThree = elementThree.getContext("2d");
    
    this.scale = scale || 30;
    this.dtRemaining = 0;
    this.stepAmount = 1/60;
    this.diffSumTol = 500;
    
    this.textPosX = 0.0;
    this.textPosY = 0.0;
    
    this.myText = "";
       
    this.lineCount = 1;
    this.maxLineLength = 1200;

    this.wordChangeCount = 0;
    this.changeCountMax = 30;
    
    //haiku
    this.numberOfHaikus = 0;
    this.sylsLeftInLineOne = 5;
    this.sylsLeftInLineTwo = 7;
    this.sylsLeftInLineThree = 5;
    this.activeLine = 1;
    
    this.minSyl = 1;
    this.maxSyl = 4;
    this.NumNounSyl = 0;
    this.NumVerbSyl = 0;
    this.NumAdjectiveSyl = 0;
    this.NumAdverbSyl = 0;
    
    //sound stuff
    this.playing = false;
    this.amplitude = 0.1;
    this.audioContext = aContext;
    this.setWords();
   
};

Physics.prototype.setWords = function() {
    this.NumNounSyl = this.getRandomInt(1,4);
    this.NumVerbSyl = this.getRandomInt(1,4);
    this.NumAdjectiveSyl = this.getRandomInt(1,4);
    this.NumAdverbSyl = this.getRandomInt(1,4);

    switch (this.NumNounSyl) {
        case 1 :
            this.myNoun = this.myWords.GetRandomOneNoun();
            break;
        case 2 :
            this.myNoun = this.myWords.GetRandomTwoNoun();
            break;
        case 3 :
            this.myNoun = this.myWords.GetRandomThreeNoun();
            break;
        case 4 :
            this.myNoun = this.myWords.GetRandomFourNoun();
            break;
        default:
            break;
    }
    switch (this.NumVerbSyl) {
        case 1 :
            this.myVerb = this.myWords.GetRandomOneVerb();
            break;
        case 2 :
            this.myVerb = this.myWords.GetRandomTwoVerb();
            break;
        case 3 :
            this.myVerb = this.myWords.GetRandomThreeVerb();
            break;
        case 4 :
            this.myVerb = this.myWords.GetRandomFourVerb();
            break;
        default:
            break;
    }
    switch (this.NumAdverbSyl) {
        case 1 :
            this.myAdv = this.myWords.GetRandomOneAdverb();
            break;
        case 2 :
            this.myAdv = this.myWords.GetRandomTwoAdverb();
            break;
        case 3 :
            this.myAdv = this.myWords.GetRandomThreeAdverb();
            break;
        case 4 :
            this.myAdv = this.myWords.GetRandomFourAdverb();
            break;
        default:
            break;
    }
    switch (this.NumAdjectiveSyl) {
        case 1 :
            this.myAdj = this.myWords.GetRandomOneAdjective();
            break;
        case 2 :
            this.myAdj = this.myWords.GetRandomTwoAdjective();
            break;
        case 3 :
            this.myAdj = this.myWords.GetRandomThreeAdjective();
            break;
        case 4 :
            this.myAdj = this.myWords.GetRandomFourAdjective();
            break;
        default:
            break;
    }

    

}
Physics.prototype.getRandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

Physics.prototype.step = function (dt,imgData,oldData) {
 
    this.dtRemaining += dt;
    while (this.dtRemaining > this.stepAmount) {
        this.dtRemaining -= this.stepAmount;
        this.world.Step(this.stepAmount,
                        8, // velocity iterations
                        3); // position iterations
    }
    this.RenderWorld(imgData,oldData,this.context,this.contextThree);
    //this.RenderWorldTwo(this.contextTwo);
   }

Physics.prototype.RenderWorld = function(imgData,oldData,ctx,ctx2) {
   // this.context.clearRect(0, 0, this.element.width, this.element.height);
    var wasHit = false;
    var obj = this.world.GetBodyList();
    
    ctx.save();
    ctx.scale(this.scale, this.scale);
    while (obj) {
        var body = obj.GetUserData();
        if (body) {
            if(body.details.wordType == "verb")
                body.draw(ctx,this.myVerb,this.NumVerbSyl);
            if(body.details.wordType == "noun")
                body.draw(ctx,this.myNoun,this.NumNounSyl);
            if(body.details.wordType == "adj")
                body.draw(ctx,this.myAdj,this.NumAdjectiveSyl);
            if(body.details.wordType == "adv")
                body.draw(ctx,this.myAdv,this.NumAdverbSyl);
           // if(body.details.wordType == "pro")
             //   body.draw(ctx,this.myPro);
            //if(body.details.wordType == "pre")
              //  body.draw(ctx,this.myPre);
            wasHit = false;
            wasHit = this.HitCenterOfMass(imgData,oldData,body);
            if(wasHit && body.details.impulseActive) {
                this.RenderText(ctx2,body.details.wordType);
            }

            
                
        }
    obj = obj.GetNext();
    }
    ctx.restore();
}
/*Physics.prototype.RenderWorldTwo = function(ctx) {
    var obj = this.world.GetBodyList();
    
    ctx.save();
    ctx.scale(this.scale, this.scale);
    while (obj) {
        var body = obj.GetUserData();
        if (body) {
            if(body.details.wordType == "verb")
                body.drawTwo(ctx,this.myVerb);
            if(body.details.wordType == "noun")
                body.drawTwo(ctx,this.myNoun);
            if(body.details.wordType == "adj")
                body.drawTwo(ctx,this.myAdj);
            if(body.details.wordType == "adv")
                body.drawTwo(ctx,this.myAdv);
        }
        obj = obj.GetNext();
    }
    ctx.restore();
}*/

Physics.prototype.RenderText = function(ctx,wtype) {
    ctx.save();
    ctx.fillStyle = "black";
    var fontSize = 18;
    var font = fontSize +"px courier";
    ctx.font = font;
    ctx.textBaseline = "top";
    var text = "";
    if(wtype == "noun")
        text = this.myNoun + " ";
    if(wtype == "verb")
        text = this.myVerb + " ";
    if(wtype == "adj")
        text = this.myAdj  + " ";
    if(wtype == "adv")
        text = this.myAdv  + " ";
    //if(wtype == "pro")
    //    text = this.myPro  + " ";
    //if(wtype == "pre")
    //    text = this.myPre  + " ";
    
    
    this.myText = this.myText + text;
    
    
    ctx.fillText(this.myText, this.textPosX, this.textPosY);
    if(this.activeLine == 1) {
        this.SetSylLeftLineOne(wtype);
        if(this.sylsLeftInLineOne > 0)
            this.ResetBodiesNotHit(this.sylsLeftInLineOne);
        if(this.sylsLeftInLineOne <= 0) {
            this.myText = "";
            this.textPosY = this.textPosY + fontSize;
            this.sylsLeftInLineOne = 5;
            this.activeLine = this.activeLine + 1;
            this.setWords();
        }
    } else if(this.activeLine == 2) {
        this.SetSylLeftLineTwo(wtype);
        if(this.sylsLeftInLineTwo > 0)
            this.ResetBodiesNotHit(this.sylsLeftInLineTwo);
        if(this.sylsLeftInLineTwo <= 0) {
            this.myText = "";
            this.textPosY = this.textPosY + fontSize;
            this.sylsLeftInLineTwo = 7;
            this.activeLine = this.activeLine + 1;
            this.setWords();
        }
    } else if(this.activeLine == 3) {
        this.SetSylLeftLineThree(wtype);
        if(this.sylsLeftInLineThree > 0)
            this.ResetBodiesNotHit(this.sylsLeftInLineThree);
        if(this.sylsLeftInLineThree <= 0) {
            this.myText = "";
            this.textPosY = this.textPosY + (fontSize*3);
            this.sylsLeftInLineThree = 5;
            this.activeLine = 1;
            this.setWords();
            this.numberOfHaikus = this.numberOfHaikus + 1;
            //this.contextTwo.clearRect(0,0,this.elementTwo.width,this.elementTwo.height);
            //this.contextTwo.fillStyle = "lightgray";
            //this.contextTwo.fillRect(0,0,this.elementTwo.width,this.elementTwo.height);
            if(this.numberOfHaikus % 5 == 0) {
                this.textPosX = this.textPosX + 426.666;
                this.textPosY = 0.0;
                if(this.numberOfHaikus == 15) {
                    this.contextThree.clearRect(0,0,this.elementThree.width,this.elementThree.height);
                    this.textPosY = 0.0;
                    this.textPosX = 0.0;
                    this.numberOfHaikus = 0;
                }
            }
        }
      }
    ctx.restore();
}

Physics.prototype.SetSylLeftLineOne = function(wtype) {
    switch (wtype) {
        case "noun":
            this.sylsLeftInLineOne = this.sylsLeftInLineOne - this.NumNounSyl;
            break;
        case "verb":
            this.sylsLeftInLineOne = this.sylsLeftInLineOne - this.NumVerbSyl;
            break;
        case "adj":
            this.sylsLeftInLineOne = this.sylsLeftInLineOne - this.NumAdjectiveSyl;
            break;
        case "adv":
            this.sylsLeftInLineOne = this.sylsLeftInLineOne - this.NumAdverbSyl;
            break;
        default:
            break;
    }
}

Physics.prototype.SetSylLeftLineTwo = function(wtype) {
    switch (wtype) {
        case "noun":
            this.sylsLeftInLineTwo = this.sylsLeftInLineTwo - this.NumNounSyl;
            break;
        case "verb":
            this.sylsLeftInLineTwo = this.sylsLeftInLineTwo - this.NumVerbSyl;
            break;
        case "adj":
            this.sylsLeftInLineTwo = this.sylsLeftInLineTwo - this.NumAdjectiveSyl;
            break;
        case "adv":
            this.sylsLeftInLineTwo = this.sylsLeftInLineTwo - this.NumAdverbSyl;
            break;
        default:
            break;
    }
}

Physics.prototype.SetSylLeftLineThree = function(wtype) {
    switch (wtype) {
        case "noun":
            this.sylsLeftInLineThree = this.sylsLeftInLineThree - this.NumNounSyl;
            break;
        case "verb":
            this.sylsLeftInLineThree = this.sylsLeftInLineThree - this.NumVerbSyl;
            break;
        case "adj":
            this.sylsLeftInLineThree = this.sylsLeftInLineThree - this.NumAdjectiveSyl;
            break;
        case "adv":
            this.sylsLeftInLineThree = this.sylsLeftInLineThree - this.NumAdverbSyl;
            break;
        default:
            break;
    }
}

Physics.prototype.ResetBodiesNotHit = function(sylLeft) {
    var obj = this.world.GetBodyList();
   
    while (obj) {
        
        var body = obj.GetUserData();
        if (body) {
            this.setWords();
            //this.SetWordSylLeft(body,sylLeft);
        }
        obj = obj.GetNext();
    }
}

Physics.prototype.SetWordSylLeft = function(body,sylLeft) {
    switch (body.details.wordType) {
        case "noun":
            //console.log("INSet new Noun: ",sylLeft);
            if(sylLeft >= this.maxSyl) {
                this.NumNounSyl = this.getRandomInt(1,this.maxSyl);
            } else {
                this.NumNounSyl = this.getRandomInt(1,sylLeft);
            }
            this.SetNewNoun();
            break;
        case "verb":
            if(sylLeft >= this.maxSyl) {
                this.NumVerbSyl = this.getRandomInt(1,this.maxSyl);
            } else {
                this.NumVerbSyl = this.getRandomInt(1,sylLeft);
            }
            this.SetNewVerb();
            break;
        case "adj":
            if(sylLeft >= this.maxSyl) {
                this.NumAdjectiveSyl = this.getRandomInt(1,this.maxSyl);
            } else {
                this.NumAdjectiveSyl = this.getRandomInt(1,sylLeft);
            }
            this.SetNewAdjective();
            break;
        case "adv":
            if(sylLeft >= this.maxSyl) {
                this.NumAdverbSyl = this.getRandomInt(1,4);
            } else {
                this.NumAdverbSyl = this.getRandomInt(1,sylLeft);
            }
            this.SetNewAdverb();
            break;
        default:
            break;
            
    }
}

Physics.prototype.SetNewNoun = function() {
    switch (this.NumNounSyl) {
        case 1 :
            this.myNoun = this.myWords.GetRandomOneNoun();
            break;
        case 2 :
            this.myNoun = this.myWords.GetRandomTwoNoun();
            break;
        case 3 :
            this.myNoun = this.myWords.GetRandomThreeNoun();
            break;
        case 4 :
            this.myNoun = this.myWords.GetRandomFourNoun();
            break;
        default:
            break;
    }
}

Physics.prototype.SetNewVerb = function() {
    switch (this.NumVerbSyl) {
        case 1 :
            this.myVerb = this.myWords.GetRandomOneVerb();
            break;
        case 2 :
            this.myVerb = this.myWords.GetRandomTwoVerb();
            break;
        case 3 :
            this.myVerb = this.myWords.GetRandomThreeVerb();
            break;
        case 4 :
            this.myVerb = this.myWords.GetRandomFourVerb();
            break;
        default:
            break;
    }
}

Physics.prototype.SetNewAdverb = function() {
    switch (this.NumAdverbSyl) {
        case 1 :
            this.myAdv = this.myWords.GetRandomOneAdverb();
            break;
        case 2 :
            this.myAdv = this.myWords.GetRandomTwoAdverb();
            break;
        case 3 :
            this.myAdv = this.myWords.GetRandomThreeAdverb();
            break;
        case 4 :
            this.myAdv = this.myWords.GetRandomFourAdverb();
            break;
        default:
            break;
    }
}

Physics.prototype.SetNewAdjective = function() {
    switch (this.NumAdjectiveSyl) {
        case 1 :
            this.myAdj = this.myWords.GetRandomOneAdjective();
            break;
        case 2 :
            this.myAdj = this.myWords.GetRandomTwoAdjective();
            break;
        case 3 :
            this.myAdj = this.myWords.GetRandomThreeAdjective();
            break;
        case 4 :
            this.myAdj = this.myWords.GetRandomFourAdjective();
            break;
        default:
            break;
    }
}


Physics.prototype.click = function(callback) {
    var self = this;
    
    function handleClick(e) {
        e.preventDefault();
        var point = {
        x: (e.offsetX || e.layerX) / self.scale,
        y: (e.offsetY || e.layerY) / self.scale
        };
        console.log("Click point: ",point.x,point.y);
        self.world.QueryPoint(function(fixture) {
                              callback(fixture.GetBody(),
                                       fixture,
                                       point);
                              },point);
    }
    
    this.element.addEventListener("click",handleClick);
    this.element.addEventListener("touchstart",handleClick);
};

Physics.prototype.HitTest = function(imgData,oldData,body) {
    var sum = 0;
    if(body.details.type != "static") {
    var yStart = Math.round(body.body.GetWorldCenter().y*2 - body.details.height)
    var yEnd  = Math.round(body.body.GetWorldCenter().y*2 + body.details.height);
    var xStart = Math.round(body.body.GetWorldCenter().x*2 - body.details.width);
    var xEnd  = Math.round(body.body.GetWorldCenter().x*2 + body.details.width);
    for(var i=yStart; i<yEnd; i++) {
        for(var j=xStart; j<xEnd; j++) {
            var idx = (j + (i * 1080))*4;
            if (this.isIn(j,i,body)) {
                
                sum += ((imgData.data[idx]-oldData.data[idx])*(imgData.data[idx]-oldData.data[idx]));
            }
        }
    }
    sum = Math.sqrt(sum);
    if(sum > 0 && !isNaN(sum)) {
        if(sum > this.diffSumTol) {
            var xNeg = Math.random();
            var yNeg = Math.random();
            if(xNeg < 0.5 && yNeg < 0.5)
                body.body.ApplyImpulse({ x: sum*10000, y: sum*10000}, body.body.GetWorldCenter());
            if(xNeg > 0.5 && yNeg < 0.5)
                body.body.ApplyImpulse({ x: -1.0*sum*10000, y: sum*10000}, body.body.GetWorldCenter());
            if(xNeg < 0.5 && yNeg > 0.5)
                body.body.ApplyImpulse({ x: sum*10000, y: -1.0*sum*10000}, body.body.GetWorldCenter());
            if(xNeg > 0.5 && yNeg > 0.5)
                body.body.ApplyImpulse({ x: -1.0*sum*10000, y: -1.0*sum*10000}, body.body.GetWorldCenter());

        }
    }
    }
};

Physics.prototype.HitCenterOfMass = function(imgData,oldData,body) {
    var sum = 0;
    var densSumX = 0;
    var massSumX = 0;
    var densSumY = 0;
    var massSumY = 0;
    var xCenter = 0;
    var yCenter = 0;
    var xNorm = 0;
    var yNorm = 0;
    var xSqr = 0;
    var ySqr = 0;
    var diffMag = 0;
    var hit = false;
    var worldWidth = 1080;
    if(body.details.type != "static" && !body.details.impulseActive) {
        var yStart = Math.round(body.body.GetWorldCenter().y*2 - body.details.radius)
        var yEnd  = Math.round(body.body.GetWorldCenter().y*2 + body.details.radius);
        var xStart = Math.round(body.body.GetWorldCenter().x*2 - body.details.radius);
        var xEnd  = Math.round(body.body.GetWorldCenter().x*2 + body.details.radius);
        for(var i=yStart; i<yEnd; i++) {
            for(var j=xStart; j<xEnd; j++) {
                var idx = (j + (i * worldWidth))*4;
                if (this.isIn(j,i,body)) {
                    diffMag = Math.sqrt(((imgData.data[idx]-oldData.data[idx])*(imgData.data[idx]-oldData.data[idx])));
                    densSumX = (diffMag*j)+densSumX;
                    densSumY = (diffMag*i)+densSumY;
                    massSumX = diffMag+massSumX;
                    massSumY = diffMag+massSumY;
                }
            }
        }
      //  console.log("massSumX: ",massSumX);
        if(massSumX > 0 && !isNaN(massSumX) && massSumX > 5000) {
            xCenter = densSumX/massSumX;
            yCenter = densSumY/massSumY;
        
            xSqr = (xCenter - (body.body.GetWorldCenter().x*2))*(xCenter - (body.body.GetWorldCenter().x*2));
            ySqr = (yCenter - (body.body.GetWorldCenter().y*2))*(yCenter - (body.body.GetWorldCenter().y*2));
        
        
            xNorm = (xCenter - (body.body.GetWorldCenter().x*2))/Math.sqrt(xSqr+ySqr);
            yNorm = (yCenter - (body.body.GetWorldCenter().y*2))/Math.sqrt(xSqr+ySqr);
        
            xNorm = xNorm*-1;
            yNorm = yNorm*-1;
            
            if(!isNaN(xNorm) && !isNaN(yNorm)) {
                body.body.ApplyImpulse({ x: (xNorm*500000), y: (yNorm*500000)}, body.body.GetWorldCenter());
                body.details.impulseActive = true;
                body.PlayTone(body);
                hit = true;
            }
        }
    }
    return hit;
};

Physics.prototype.isIn = function(x,y,body) {
    
    var xDiff  = x - body.body.GetWorldCenter().x*2;
    var yDiff = y - body.body.GetWorldCenter().y*2;
    var dist = Math.sqrt((xDiff*xDiff)+(yDiff*yDiff));
    if(dist <= body.details.radius || dist <= body.details.width || dist <= body.details.height) {
        return true;
    } else {
        return false;
    }
};


Physics.prototype.collision = function () {
    this.listener = new Box2D.Dynamics.b2ContactListener();
    
    this.listener.BeginContact = function(contact) {
        var body = contact.GetFixtureB().GetBody().GetUserData();
        //var body2 = contact.GetFixtureA().GetBody().GetUserData();
        if(body.details.impulseActive) {
            body.details.impulseActive = false;
            body.PauseTone(body);
        }
    }
    
    this.world.SetContactListener(this.listener);
    
};

