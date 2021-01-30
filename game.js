const textElement = document.getElementById('text')
const imageElement = document.getElementById('roomimage')
const optionButtonsElement = document.getElementById('option-buttons')
function disableOptionsUntilDone(audio) {
    const buttons = document.getElementById("option-buttons")
    buttons.style.display = 'none'
    clearTimeout(endTimer)
    const timeLeft = endTime - Date.now()
    audio.addEventListener('ended', () => {
        buttons.style.display = ""
        startTimer(timeLeft)
    })
}

var Rumble
var Stevia = new Audio('SFX/Stevia.mp3')
var Yap
var Whine
var Poo = new Audio('SFX/brucePoo.mp3')
var Goodnight = new Audio('SFX/goodnightBruce.mp3')
var Winner = new Audio('SFX/Winner.mp3')
var Joke
var Click
let state = {

}
function startGame() {
    state = {}
    showScreen("gamescreen",)
}
const nopeScreen = {
    id: "nopeScreen",
    text: "Sorry, no Bruce!",
    options: [
        {
            text: 'Ok',
        },
    ]

}
function showScreen(textNodeIndex) {
    if (textNodeIndex === hidingPlace) {
        showScreen("youWin")
        return
    }
    else if (hidableRooms.includes(textNodeIndex)) {
        const previous = textNodeIndex.slice(0, textNodeIndex.indexOf("Search"))
        const look = textNodes.find(room => room.options.some(option => option.nextText === previous))
        nopeScreen.options[0].nextText = look.id
        showScreen("nopeScreen")
        return
    }
    const textNode = textNodes.find(textNode => textNode.id === textNodeIndex)
    textElement.innerText = textNode.text
    imageElement.style.backgroundImage = `url(pngs/${textNode.id}.png)`
    while (optionButtonsElement.firstChild) {
        optionButtonsElement.removeChild(optionButtonsElement.firstChild)
    }
    textNode.options.forEach(option => {
        if (showOption(option)) {
            const button = document.createElement('button')
            button.innerText = option.text
            button.classList.add('btn')
            button.addEventListener('click', () => selectOption(option))
            optionButtonsElement.appendChild(button)

        }
    })
    textNode.onShow?.()
}

function showOption(option) {
    return option.requiredState == null || option.requiredState(state)

}
let endTime
let endTimer
function selectOption(option) {
    const nextTextNodeId = option.nextText
    if (nextTextNodeId <= 0) {
        return startGame()
    }
    state = Object.assign(state, option.setState)
    showScreen(nextTextNodeId)
    option.onSelect?.()
}
function startTimer(duration) {
    endTime = Date.now() + duration
    endTimer = setTimeout(() => showScreen("youLose"), duration)
}
function looseBruce() {
    hidingPlace = hidableRooms[getRandomInt(hidableRooms.length)]
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
let hidingPlace
const hidableRooms = [
    "entryBenchSearch",
    "entryClosetSearch",
    "diningTableSearch",
    "curioCabinetSearch",
    "kitchenClosetSearch",
    "garageTableSearch",
    "downstairsBathroomCupboardSearch",
    "downstairsBathroomTrashSearch",
    "landingPlantSearch",
    "masterBedroomBedSearch",
    "masterBedroomHamperSearch",
    "masterBedroomPlantSearch",
    "masterBedroomBookcaseSearch",
    "masterBathroomTubSearch",
    "masterBathroomCupboardSearch",
    "laundryPileSearch",
    "treasureChestSearch",
    "drawingTableSearch",
    "artChestSearch",
    "jamBoxSearch",
    "soapBoxSearch",
    "upstairsBathroomCupboardSearch",
    "upstairsBathroomTrashSearch",
    "upstairsBathroomTubSearch",
    "bruceBedSearch",
    "bruceChestSearch",
    "bruceBookShelfSearch",
]
const roomimage = document.getElementById("roomimage")
const textNodes = [
    {
        id: 'gamescreen',
        text: 'HIDE AND SEEK OR ELSE',
        onShow: () => {
            document.getElementById("option-buttons").style.gridTemplateColumns = "repeat(1,auto)"
            document.querySelector(".btn").style.border = 'none'
            document.querySelector(".btn").style.boxShadow = 'none'
            document.getElementById("roomimage").style.boxShadow = 'none'
            Rumble = new Audio('SFX/Rumble.mp3');
            Rumble.volume = 0.9;
            Rumble.play();

        },
        options: [
            {
                text: 'Play',
                nextText: 'intro',
                onSelect: () => {
                    document.getElementById("option-buttons").style.gridTemplateColumns = ""
                    roomimage.style.boxShadow = ""
                    Rumble.pause();
                    roomimage.style.width = "500px"
                    roomimage.style.height = "500px"
                    roomimage.style.backgroundSize = "500px"


                },
            },
        ]

    },
    {
        id: "intro",

        text: 'You are relaxing in your Living Room, bundled in blankets and enjoying a hot mug of something nice. You realize that Bruce is standing in the Entry Hall; staring at you. Do you make eye contact with Bruce and Accept His Challenge?',
        options: [
            {
                text: 'Yes.',
                setState: { looseBruce: true },
                nextText: "bruceStart",
            },

            {
                text: 'No.',
                setState: { loosePoop: true },
                nextText: "poopStart",
            }
        ]

    },
    {
        id: "bruceStart",
        text: 'Bruce flees into darkness. The game is on!',
        onShow: () => {
            Yap = new Audio('SFX/bruceYap.mp3'),
                Yap.play();
            Yap.volume = 0.05;
        },
        options: [
            {
                text: 'Let\'s Play',
                requiredState: (currentState) => currentState.looseBruce,
                setState: { looseBruce: true },
                onSelect: () => {
                    startTimer(180000)
                    looseBruce()
                },
                nextText: "livingRoom",
            }
        ]



    },
    {
        id: "poopStart",
        onShow: () => {
            Whine = new Audio('SFX/bruceWhine.mp3'),
                Whine.play();
            Whine.volume = .04;

        },
        text: "You have disappointed your dog.",
        options: [
            {
                text: 'Oh well',
                requiredState: (currentState) => currentState.loosePoop,
                setState: { loosePoop: true },
                nextText: "pooContinue",
            }
        ]

    },
    {
        id: "pooContinue",
        text: "You settle back into the sofa, enjoying the fire. Some time passes before a Faint Hint of Unpleasantness mists into the Living Room. Oh no.",
        options: [
            {
                text: 'Find that smell or Pass Out to Death',
                nextText: "pooEnd",
            }

        ]
    },
    {
        id: "pooEnd",
        text: "Oh. Looks like Bruce made a Spite Doody in your Slipper. Restart?",
        onShow: () => {
            Poo.play();
            Poo.volume = 0.1;
        },
        options: [
            {
                text: 'Ok',
                nextText: "gamescreen",
            }
        ]

    },
    nopeScreen,
    {
        id: "livingRoom",
        text: "You are standing in the Living Room. Bruce would not be hiding in here.",
        onShow: () => {
            Stevia.play();
            Stevia.volume = 0.2;
        },
        options: [
            {
                text: 'Go',
                nextText: "livingRoomGo",
            },
        ]
    },

    {
        id: "livingRoomLook",
        text: "What do you want to Look at?",
        options: [
            {
                text: "Sofa",
                nextText: "livingRoomSofa",
            },
            {
                text: "Coffee Table",
                nextText: 'livingRoomCoffeeTable',
            },
            {
                text: "Medium-Screen Television",
                nextText: 'livingRoomTv',
            },
            {
                text: 'Back',
                nextText: 'livingRoom',
            },

        ]


    },
    {
        id: 'livingRoomSofa',
        text: "He.",
        options: [
            {
                text: "Ok",
                nextText: 'livingRoomLook',
            },
        ]
    },
    {
        id: "livingRoomCoffeeTable",
        text: 'Please don\'t put your feet up on it. Oh, and it\'s also a very stupid place to hide.',
        options: [
            {
                text: 'Ok',
                nextText: 'livingRoomLook',
            },
        ]
    },
    {
        id: 'livingRoomTv',
        text: 'A Medium Screen TV mounted above the fireplace. This is an impossible place for a Bruce to hide. Dummy.',
        options: [
            {
                text: '...',
                nextText: 'livingRoomLook',
            },
        ]

    },
    {
        id: 'livingRoomGo',
        text: 'Where will you Go?',
        options: [
            {
                text: 'Entry Hall',
                nextText: 'entryHall',
            },
            {
                text: 'Dining Room',
                nextText: "diningRoom",
            },
            {
                text: 'Back',
                nextText: 'livingRoom',
            },
        ]
    },
    {
        id: 'entryHall',
        text: 'You are standing in the Entry Hall.',
        options: [
            {
                text: 'Look',
                nextText: 'entryHallLook',
            },
            {
                text: 'Go',
                nextText: 'entryHallGo',
            },
        ]
    },
    {
        id: 'entryHallLook',
        text: 'What do you want to Look at?',
        options: [
            {
                text: 'Bench',
                nextText: 'entryBench'

            },
            {
                text: 'Closet',
                nextText: 'entryCloset',
            },
            {
                text: 'Back',
                nextText: 'entryHall',
            },

        ]
    },
    {
        id: 'entryBench',
        text: 'It\'s a crummy seat, but an ok hiding spot.',
        options: [
            {
                text: 'Search',
                nextText: 'entryBenchSearch',
            },
            {
                text: 'Back',
                nextText: 'entryHallLook',
            },
        ]
    },
    {
        id: 'entryCloset',
        text: 'A closet stuffed with coats, boots and maybe...a Bruce?',
        options: [
            {
                text: 'Search',
                nextText: 'entryClosetSearch',
            },
            {
                text: 'Back',
                nextText: 'entryHallLook',
            },
        ]

    },
    {
        id: 'entryHallGo',
        text: 'Where will you Go?',
        options: [
            {
                text: 'Bathroom',
                nextText: 'downstairsBathroom',

            },
            {
                text: 'Upstairs',
                nextText: 'upstairs',
            },
            {
                text: 'Kitchen',
                nextText: 'kitchen',

            },
            {
                text: 'Living Room',
                nextText: 'livingRoom',
            },
            {
                text: 'Back',
                nextText: 'entryHall',
            }
        ]
    },
    {
        id: 'diningRoom',
        text: 'You are Standing in the Dining Room.',
        options: [
            {
                text: 'Look',
                nextText: 'diningRoomLook',
            },
            {
                text: 'Go',
                nextText: 'diningRoomGo',

            },

        ]

    },
    {
        id: 'diningRoomLook',
        text: 'What do you want to Look at?',
        options: [
            {
                text: 'Dining Table',
                nextText: 'diningTable',
            },
            {
                text: 'Curio Cabinet',
                nextText: 'curioCabinet',
            },
            {
                text: 'Cake',
                nextText: 'cake',
            },
            {
                text: 'Back',
                nextText: 'diningRoom',
            },

        ]
    },
    {
        id: 'diningTable',
        text: 'It\'s a prefab Diningroom Table. Perfect for collecting dents, scuffs and hiding pups.',
        options: [
            {
                text: 'Search',
                nextText: 'diningTableSearch',
            },
            {
                text: 'Back',
                nextText: 'diningRoomLook',
            },
        ]

    },
    {
        id: 'curioCabinet',
        text: 'Filled with cottage-core curios. A could-be hiding spot.',
        options: [
            {
                text: 'Search',
                nextText: 'diningTableSearch',
            },
            {
                text: 'Back',
                nextText: 'diningRoomLook',
            },
        ]
    },
    {
        id: 'cake',
        text: 'Cake for Breakfast. With coffee.',
        options: [
            {
                text: 'Yum.',
                nextText: 'diningRoomLook',
            },
        ]
    },
    {
        id: 'diningRoomGo',
        text: 'Where would you like to Go?',
        options: [
            {
                text: 'Kitchen',
                nextText: 'kitchen',
            },
            {
                text: 'Living Room',
                nextText: 'livingRoom',
            }

        ]
    },
    {
        id: 'kitchen',
        text: 'You are standing in the Kitchen.',
        options: [
            {
                text: 'Look',
                nextText: 'kitchenLook',
            },
            {
                text: 'Go',
                nextText: 'kitchenGo',
            },
        ]
    },
    {
        id: 'kitchenLook',
        text: 'What would you like to Look at?',
        options: [

            {
                text: 'Fridge',
                nextText: 'fridge',
            },

            {
                text: 'Closet',
                nextText: 'kitchenCloset',
            },

            {
                text: 'Cookie Jar',
                nextText: 'cookieJar',
            },

            {
                text: 'Back',
                nextText: 'kitchen',
            },
        ]

    },
    {
        id: 'fridge',
        text: 'It\'s locked to keep Bruce the hell away from my icecream.',
        options: [
            {
                text: 'Ok.',
                nextText: 'kitchenLook',
            },
        ]
    },
    {
        id: 'cookieJar',
        text: 'It\'s filled with Bruce\'s favorites. It\'s also too high to hide in.',
        options: [
            {
                text: 'Ok.',
                nextText: 'kitchenLook',
            },
        ]
    },
    {
        id: 'supperDish',
        text: 'Ok, it\'s an Every Meal Dish, but that doesn\'t sound as cute. Far too small for Bruce to hide in or around.',
        options: [
            {
                text: 'Ok.',
                nextText: 'kitchenLook',
            },
        ]
    },
    {
        id: 'waterBowl',
        text: 'Clean and clear water for Bruce. Just no space to hide.',
        options: [
            {
                text: 'Ok.',
                nextText: 'kitchenLook',
            },
        ]
    },
    {
        id: "kitchenCabinet",
        text: "I'd prefer he stay away from the drain cleaner...A dangerous but possible place for Bruce to hide",
        options: [
            {
                text: 'Search',
                nextText: 'kitchenCabinetSearch',
            },
            {
                text: 'Back',
                nextText: 'kitchenLook',
            },

        ]


    },
    {
        id: "dishWasher",
        text: "Bruce wants me to get rid of this so HE can be the Dish Washer. Dish Licker. Which is, of course, a sin against hygene and decency. He's not allowed to play in here, anyway.",
        options: [
            {
                text: 'Search',
                nextText: 'looseBruce',
            },
            {
                text: 'Back',
                nextText: 'kitchenLook',
            },

        ]


    },
    {
        id: "kitchenTrash",
        text: "If he's in here, then he's also in trouble.",
        options: [
            {
                text: 'Search',
                nextText: 'kitchenTrashSearch',
            },
            {
                text: 'Back',
                nextText: 'kitchenLook',
            },

        ]


    },
    {
        id: "kitchenCloset",
        text: "Boring cleaning supplies. He might be in here.",
        options: [
            {
                text: 'Search',
                nextText: 'kitchenClosetSearch',
            },
            {
                text: 'Back',
                nextText: 'kitchenLook',
            },

        ]


    },
    {
        id: 'kitchenGo',
        text: 'Where would you like to Go?',
        options: [
            {
                text: 'Dining Room',
                nextText: 'diningRoom',
            },
            {
                text: 'Garage',
                nextText: 'garage',
            },
            {
                text: 'Entry Hall',
                nextText: 'entryHall',
            },
        ]
    },
    {
        id: 'garage',
        text: 'You are standing in the Garage.',
        options: [
            {
                text: 'Look',
                nextText: 'garageLook',
            },
            {
                text: 'Go',
                nextText: 'garageGo',
            },
        ]
    },
    {
        id: 'garageLook',
        text: 'What do you want to Look at?',
        options: [
            {
                text: 'Work Table',
                nextText: 'garageTable',
            },
            {
                text: 'Back',
                nextText: 'garage',
            },

        ]
    },
    {
        id: 'garageBoxes',
        text: "It's a stack of boxes filled with bits and bobs, odds and ends....probably spiders...maybe Bruce?",
        options: [
            {
                text: 'Search',
                nextText: 'looseBruce',
            },
            {
                text: 'Back',
                nextText: 'garageRoomLook',
            },
        ]

    },
    {
        id: 'garageTable',
        text: "It\'s the Work Table. I keep it organized by not touching anything, ever. Bruce could be behind it.",
        options: [
            {
                text: 'Search',
                nextText: 'garageTableSearch',
            },
            {
                text: 'Back',
                nextText: 'garageLook',
            },
        ]

    },
    {
        id: 'garageShelf',
        text: "A place for tools. And the rest of the Holiday Decorations. There's space underneath that a Bruce could squirm into.",
        options: [
            {
                text: 'Search',
                nextText: 'looseBruce',
            },
            {
                text: 'Back',
                nextText: 'garageRoomLook',
            },
        ]

    },
    {
        id: 'garageGo',
        text: 'Where would you like to Go?',
        options: [
            {
                text: 'Kitchen',
                nextText: 'kitchen',
            },
        ]
    },
    {
        id: 'downstairsBathroom',
        text: 'You are standing in the Downstairs Bathroom.',
        options: [
            {
                text: 'Look.',
                nextText: 'downstairsBathroomLook',
            },
            {
                text: 'Go',
                nextText: 'downstairsBathroomGo',
            },
        ]
    },
    {
        id: 'downstairsBathroomLook',
        text: 'What do you want to Look at?',
        options: [
            {
                text: 'Vanity Cupboard',
                nextText: 'downstairsBathroomCupboard',
            },
            {
                text: 'Waste Basket',
                nextText: 'downstairsBathroomTrash',
            },
            {
                text: 'Back',
                nextText: 'downstairsBathroom',
            },

        ]
    },
    {
        id: 'downstairsBathroomCupboard',
        text: "Better not be shredding the toilet paper again.",
        options: [
            {
                text: 'Search',
                nextText: 'downstairsBathroomCupboardSearch',
            },
            {
                text: 'Back',
                nextText: 'downstairsBathroomLook',
            },
        ]

    },
    {
        id: 'downstairsBathroomTrash',
        text: "Ugh, I hope not.",
        options: [
            {
                text: 'Search',
                nextText: 'downstairsBathroomTrashSearch',
            },
            {
                text: 'Back',
                nextText: 'downstairsBathroomLook',
            },
        ]

    },
    {
        id: 'downstairsBathroomGo',
        text: 'Where would you like to Go?',
        options: [
            {
                text: 'Kitchen',
                nextText: 'kitchen',
            },
            {
                text: 'Entry Hall',
                nextText: 'entryHall',
            },
        ]
    },

    {
        id: 'upstairs',
        text: 'You are standing on the Stairs.',
        options: [
            {
                text: 'Head Up',
                nextText: 'landing',
            },
            {
                text: 'Walk On Down',
                nextText: 'entryHallGo',
            },
        ]
    },
    {
        id: 'landing',
        text: 'You are standing in the Landing.',
        options: [
            {
                text: 'Look',
                nextText: 'landingLook',
            },
            {
                text: 'Go',
                nextText: 'landingGo',
            },
        ]
    },
    {
        id: 'landingLook',
        text: 'What do you want to Look at?',
        options: [
            {
                text: 'Precarious Plant',
                nextText: 'landingPlant',
            },
            {
                text: 'Back',
                nextText: 'landing',
            },

        ]
    },
    {
        id: 'landingPlant',
        text: "This feels like a 'Fall on Your Head and Brain You Hazard'. A dangeorus hiding place.'",
        options: [
            {
                text: 'Search',
                nextText: 'landingPlantSearch',
            },
            {
                text: 'Back',
                nextText: 'landingLook',
            },
        ]

    },

    {
        id: 'landingGo',
        text: 'Where would you like to Go?',
        options: [
            {
                text: 'Master Bedroom',
                nextText: 'masterBedroom',
            },
            {
                text: 'Tiny Room',
                nextText: 'tinyRoom',
            },
            {
                text: 'Laundry Room',
                nextText: 'laundryRoom',
            },
            {
                text: 'Bathroom',
                nextText: 'upstairsBathroom',
            },
            {
                text: 'Bedroom',
                nextText: 'bedroom',
            },
            {
                text: 'Downstairs',
                nextText: 'upstairs',
            },
            {
                text: 'Back',
                nextText: 'landing',
            },
        ]
    },
    {
        id: 'masterBedroom',
        text: 'You are standing in the Master Bedroom.',
        options: [
            {
                text: 'Look',
                nextText: 'masterBedroomLook',
            },
            {
                text: 'Go',
                nextText: 'masterBedroomGo',
            },
        ]
    },
    {
        id: 'masterBedroomLook',
        text: 'What do you want to Look at?',
        options: [
            {
                text: 'Comfy Bed',
                nextText: 'masterBedroomBed',
            },
            {
                text: 'Laundry Hamper',
                nextText: 'masterBedroomHamper',
            },
            {
                text: 'Bookcase',
                nextText: 'masterBedroomBookcase',
            },
            {
                text: 'Beuford',
                nextText: 'masterBedroomPlant',
            },
            {
                text: 'Back',
                nextText: 'masterBedroom',
            },

        ]
    },
    {
        id: 'masterBedroomBed',
        text: "Check underneath?",
        options: [
            {
                text: 'Search',
                nextText: 'masterBedroomBedSearch',
            },
            {
                text: 'Back',
                nextText: 'masterBedroomLook',
            },
        ]

    },
    {
        id: 'masterBedroomHamper',
        text: "Is there a dog among the socks?",
        options: [
            {
                text: 'Search',
                nextText: 'masterBedroomHamperSearch',
            },
            {
                text: 'Back',
                nextText: 'masterBedroomLook',
            },
        ]

    },
    {
        id: 'masterBedroomChifferobe',
        text: "Ha ha, no it's just a bureau. Chifferobe sounds more interesting, though. Like Cridenza. I don't have one of those, either. Anyway, Bruce could be behind it.",
        options: [
            {
                text: 'Search',
                nextText: 'looseBruce',
            },
            {
                text: 'Back',
                nextText: 'masterBedroomLook',
            },
        ]

    },
    {
        id: 'masterBedroomPlant',
        text: "Good evening, Beu, is Bruce hiding behind you?",
        options: [
            {
                text: 'Search',
                nextText: 'masterBedroomPlantSearch',
            },
            {
                text: 'Back',
                nextText: 'masterBedroomLook',
            },
        ]

    },
    {
        id: 'masterBedroomBookcase',
        text: "Home to every book I have ever loved.",
        options: [
            {
                text: 'Search',
                nextText: 'masterBedroomBookcaseSearch',
            },
            {
                text: 'Back',
                nextText: 'masterBedroomLook',
            },
        ]

    },

    {
        id: 'masterBedroomGo',
        text: 'Where would you like to Go?',
        options: [
            {
                text: 'Landing',
                nextText: 'landing',
            },
            {
                text: 'Master Bathroom',
                nextText: 'masterBathroom',
            },
            {
                text: 'Walk-in Closet',
                nextText: 'walkInCloset',
            },
            {
                text: 'Back',
                nextText: 'masterBedroom',
            },
        ]
    },
    {
        id: 'masterBathroom',
        text: 'You are standing in the Master Bathroom. That means it\'s the nicest bathroom.',
        options: [
            {
                text: 'Look',
                nextText: 'masterBathroomLook',
            },
            {
                text: 'Go',
                nextText: 'masterBathroomGo',
            },
        ]
    },
    {
        id: 'masterBathroomLook',
        text: 'What do you want to Look at?',
        options: [
            {
                text: 'Tub',
                nextText: 'masterBathroomTub',
            },
            {
                text: 'Vanity Cupboard',
                nextText: 'masterBathroomCupboard',
            },
            {
                text: 'Back',
                nextText: 'masterBathroom',
            },

        ]
    },
    {
        id: 'masterBathroomCupboard',
        text: "Nice smelling bath things. I hope he's not eating soap in there.",
        options: [
            {
                text: 'Search',
                nextText: 'masterBathroomCupboardSearch',
            },
            {
                text: 'Back',
                nextText: 'masterBathroomLook',
            },
        ]

    },
    {
        id: 'masterBathroomTub',
        text: "I'd be surprised.",
        options: [
            {
                text: 'Search',
                nextText: 'masterBathroomTubSearch',
            },
            {
                text: 'Back',
                nextText: 'masterBathroomLook',
            },
        ]

    },
    {
        id: 'masterBathroomGo',
        text: 'Where would you like to Go?',
        options: [
            {
                text: 'Master Bedroom',
                nextText: 'masterBedroom',
            },
            {
                text: 'Bathroom.',
                nextText: 'bathroomjoke',
            },
            {
                text: 'Back',
                nextText: 'masterBedroom',
            },
        ]
    },
    {
        id: 'bathroomjoke',
        text: 'When Nature calls it roars, I guess.',
        onShow: () => {
            Joke = new Audio('SFX/Flush.mp3')
            Joke.play();
            disableOptionsUntilDone(Joke)
            Stevia.pause();
        },

        options: [
            {
                text: 'Wash Your Hands.',
                nextText: 'masterBathroomGo',
                onSelect: () => {
                    Stevia.play();
                },
            },
        ]
    },
    {
        id: 'walkInCloset',
        text: 'You are standing in the Walk-In Closet.',
        options: [
            {
                text: 'Look',
                nextText: 'walkInClosetLook',
            },
            {
                text: 'Go',
                nextText: 'walkInClosetGo',
            },
        ]
    },
    {
        id: 'walkInClosetLook',
        text: 'What do you want to Look at?',
        options: [
            {
                text: 'Pile of Laundry',
                nextText: 'laundryPile',
            },
            {
                text: 'Real Life Treasure Chest',
                nextText: 'treasureChest',
            },
            {
                text: 'Back',
                nextText: 'walkInCloset',
            },

        ]
    },
    {
        id: 'laundryPile',
        text: "This does not exist and you are not looking at it. You can check behind it, though.",
        options: [
            {
                text: 'Search',
                nextText: 'laundryPileSearch',
            },
            {
                text: 'Back',
                nextText: 'walkInClosetLook',
            },
        ]

    },
    {
        id: 'treasureChest',
        text: "This is where I keep my booty. I mean. My trading cards.",
        options: [
            {
                text: 'Search',
                nextText: 'treasureChestSearch',
            },
            {
                text: 'Back',
                nextText: 'walkInCloset',
            },
        ]

    },
    {
        id: 'walkInClosetGo',
        text: 'Where would you like to go?',
        options: [
            {
                text: 'Master Bedroom',
                nextText: 'masterBedroom',
            },
            {
                text: 'Back',
                nextText: 'walkInCloset',
            },
        ]
    },
    {
        id: 'tinyRoom',
        text: 'You are standing in a Tiny Room.',
        options: [
            {
                text: 'Look',
                nextText: 'tinyRoomLook',
            },
            {
                text: 'Go',
                nextText: 'tinyRoomGo',
            },
        ]
    },
    {
        id: 'tinyRoomLook',
        text: 'What do you want to Look at?',
        options: [
            {
                text: 'Drawing Table',
                nextText: 'drawingTable',
            },
            {
                text: 'Art Chest',
                nextText: 'artChest',
            },
            {
                text: 'Jam Box',
                nextText: 'jamBox',
            },
            {
                text: 'Back',
                nextText: 'tinyRoom',
            },

        ]
    },
    {
        id: 'drawingTable',
        text: "It's erganomic!",
        options: [
            {
                text: 'Search',
                nextText: 'drawingTableSearch',
            },
            {
                text: 'Back',
                nextText: 'tinyRoomLook',
            },
        ]

    },
    {
        id: 'artChest',
        text: "This is where all my money goes. Well here, and in Bruce's belly.",
        options: [
            {
                text: 'Search',
                nextText: 'artChestSearch',
            },
            {
                text: 'Back',
                nextText: 'tinyRoomLook',
            },



        ]

    },

    {
        id: 'jamBox',
        text: "Large enough to hide a loaf-sized dog.",
        options: [
            {
                text: 'Search',
                nextText: 'jamBoxSearch',
            },
            {
                text: 'Back',
                nextText: 'tinyRoomLook',
            },
        ]
    },

    {
        id: 'tinyRoomGo',
        text: 'Where would you like to Go?',
        options: [
            {
                text: 'Master Bedroom',
                nextText: 'masterBedroom',
            },
            {
                text: 'Landing',
                nextText: 'landing',
            },
            {
                text: 'Laundry Room',
                nextText: 'laundryRoom',
            },
            {
                text: 'Bathroom',
                nextText: 'upstairsBathroom',
            },
            {
                text: 'Bedroom',
                nextText: 'bedroom',
            },
            {
                text: 'Downstairs',
                nextText: 'upstairs',
            },
            {
                text: 'Back',
                nextText: 'tinyRoom',
            },
        ]
    },
    {
        id: 'laundryRoom',
        text: 'You are standing in the Laundry Room.',
        options: [
            {
                text: 'Look',
                nextText: 'laundryRoomLook',
            },
            {
                text: 'Go',
                nextText: 'laundryRoomGo',
            },
        ]
    },
    {
        id: 'laundryRoomLook',
        text: 'What do you want to Look at?',
        options: [
            {
                text: 'Washer',
                nextText: 'washer',
            },
            {
                text: 'Dryer',
                nextText: 'dryer',
            },
            {
                text: 'Soap Box',
                nextText: 'soapBox',
            },
            {
                text: 'Back',
                nextText: 'laundryRoom',
            },

        ]
    },
    {
        id: 'washer',
        text: "Bruce is not allowed to play in here. Even if he does need a good spin rinse.",
        options: [
            {
                text: 'Ok',
                nextText: 'laundryRoomLook',
            },
        ]

    },
    {
        id: 'dryer',
        text: "No dogs allowed in the dryer.",
        options: [

            {
                text: 'Ok',
                nextText: 'laundryRoomLook',
            },



        ]

    },

    {
        id: 'soapBox',
        text: "Vanilla Lavender scent. Just large enough to hide a small dog.",
        options: [
            {
                text: 'Search',
                nextText: 'soapBoxSearch',
            },
            {
                text: 'Back',
                nextText: 'laundryRoomLook',
            },
        ]
    },

    {
        id: 'laundryRoomGo',
        text: 'Where would you like to Go?',
        options: [
            {
                text: 'Master Bedroom',
                nextText: 'masterBedroom',
            },
            {
                text: 'Landing',
                nextText: 'landing',
            },
            {
                text: 'Tiny Room',
                nextText: 'tinyRoom',
            },
            {
                text: 'Bathroom',
                nextText: 'upstairsBathroom',
            },
            {
                text: 'Bedroom',
                nextText: 'bedroom',
            },
            {
                text: 'Downstairs',
                nextText: 'upstairs',
            },
            {
                text: 'Back',
                nextText: 'laundryRoom',
            },
        ]
    },
    {
        id: 'upstairsBathroom',
        text: 'You are standing in the Upstairs Bathroom.',
        options: [
            {
                text: 'Look',
                nextText: 'upstairsBathroomLook',
            },
            {
                text: 'Go',
                nextText: 'upstairsBathroomGo',
            },
        ]
    },
    {
        id: 'upstairsBathroomLook',
        text: 'What do you want to Look at?',
        options: [
            {
                text: 'Vanity Cabinet',
                nextText: 'upstairsBathroomCupboard',
            },
            {
                text: 'Waste Basket',
                nextText: 'upstairsBathroomTrash',
            },
            {
                text: 'Tub',
                nextText: 'upstairsBathroomTub',
            },
            {
                text: 'Back',
                nextText: 'upstairsBathroom',
            },

        ]
    },
    {
        id: 'upstairsBathroomCupboard',
        text: "A good place for Bruce to hide.",
        options: [
            {
                text: 'Search',
                nextText: 'upstairsBathroomCupboardSearch',
            },
            {
                text: 'Back',
                nextText: 'upstairsBathroomLook',
            },
        ]

    },
    {
        id: 'upstairsBathroomTrash',
        text: "If he's in here, then it's bath time.",
        options: [
            {
                text: 'Search',
                nextText: 'upstairsBathroomCupboardSearch',
            },
            {
                text: 'Back.',
                nextText: 'upstairsBathroomLook',
            },



        ]

    },

    {
        id: 'upstairsBathroomTub',
        text: "Bruce is afraid of the tub, but he is also determined to win. Best check it.",
        options: [
            {
                text: 'Search',
                nextText: 'upstairsBathroomTubSearch',
            },
            {
                text: 'Back',
                nextText: 'upstairsBathroomLook',
            },
        ]
    },

    {
        id: 'upstairsBathroomGo',
        text: 'Where would you like to Go?',
        options: [
            {
                text: 'Master Bedroom',
                nextText: 'masterBedroom',
            },
            {
                text: 'Landing',
                nextText: 'landing',
            },
            {
                text: 'Tiny Room',
                nextText: 'tinyRoom',
            },
            {
                text: 'Laundry Room',
                nextText: 'laundryRoom',
            },
            {
                text: 'Bedroom',
                nextText: 'bedroom',
            },
            {
                text: 'Downstairs',
                nextText: 'upstairs',
            },
            {
                text: 'Back',
                nextText: 'upstairsBathroom',
            },
        ]
    },
    {
        id: 'bedroom',
        text: 'You are standing in the Bruce\'s Room.',
        options: [
            {
                text: 'Look',
                nextText: 'bedroomLook',
            },
            {
                text: 'Go',
                nextText: 'bedroomGo',
            },
        ]
    },
    {
        id: 'bedroomLook',
        text: 'What do you want to Look at?',
        options: [
            {
                text: 'Dog Bed',
                nextText: 'bruceBed',
            },
            {
                text: 'Toy Chest',
                nextText: 'bruceChest',
            },
            {
                text: 'Bookcase',
                nextText: 'bruceBookShelf',
            },
            {
                text: 'Back',
                nextText: 'bedroom',
            },
        ]
    },
    {
        id: 'bruceBed',
        text: "Bruce's canopy bed. A very comfortable place to hide.",
        options: [
            {
                text: 'Search',
                nextText: 'bruceBedSearch',
            },
            {
                text: 'Back',
                nextText: 'bedroomLook',
            },
        ]

    },
    {
        id: 'bruceChest',
        text: "Bruce's Toy Chest. It's several times larger than he is. A fun place to hide.",
        options: [
            {
                text: 'Search',
                nextText: 'bruceChestSearch',
            },
            {
                text: 'Back',
                nextText: 'bedroomLook',
            },



        ]

    },

    {
        id: 'horse',
        text: "Bruce likes to put on a tiny felt top hat and sit in its saddle. I don't know why, but it is very cute.",
        options: [
            {
                text: 'Search',
                nextText: 'looseBruce',
            },
            {
                text: 'Back',
                nextText: 'bedroomLook',
            },
        ]
    },
    {
        id: 'wardrobe',
        text: "It's a tiny Wardrobe filled with sweaters, pajamas, coats and booties for all weather. He could be hiding in here.",
        options: [
            {
                text: 'Search',
                nextText: 'looseBruce',
            },
            {
                text: 'Back',
                nextText: 'bedroomLook',
            },
        ]
    },
    {
        id: 'bruceBookShelf',
        text: "Cook Books. Row upon row of Cook Books. Bruce can't cook, but he can dream.",
        options: [
            {
                text: 'Search',
                nextText: 'bruceBookShelfSearch',
            },
            {
                text: 'Back',
                nextText: 'bedroomLook',
            },
        ]
    },
    {
        id: 'bedroomGo',
        text: 'Where would you like to Go?',
        options: [
            {
                text: 'Master Bedroom',
                nextText: 'masterBedroom',
            },
            {
                text: 'Landing',
                nextText: 'landing',
            },
            {
                text: 'Tiny Room',
                nextText: 'tinyRoom',
            },
            {
                text: 'Laundry Room',
                nextText: 'laundryRoom',
            },
            {
                text: 'Bathroom',
                nextText: 'upstairsBathroom',
            },
            {
                text: 'Downstairs',
                nextText: 'upstairs',
            },
            {
                text: 'Back',
                nextText: 'bedroom',
            },
        ]
    },

    {
        id: 'looseBruce',
        text: 'You Won! Or Maybe Lost. This hasn\'t been programmed yet.',
        options: [
            {
                text: 'Ok.',
                nextText: 'intro',
            },
        ]

    },
    {
        id: 'youLose',
        text: "Too slow! You lost the Game.",
        onShow: () => {
            Stevia.pause();
            Goodnight.play();
            Goodnight.volume = 0.1;
        },
        options: [
            {
                text: "Retry",
                nextText: 'gamescreen',
            },
        ]
    },
    {
        id: 'youWin',
        text: "Hot Dog! You Win the Day!",
        onShow: () => {
            Stevia.pause();
            Winner.play();
            Winner.volume = 0.1;
        },
        options: [
            {
                text: "Retry",
                nextText: 'gamescreen',
            },
        ]
    },


]


startGame()
