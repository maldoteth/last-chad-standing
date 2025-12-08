import { Archive, Coins, Gamepad, Handshake, Home, ShoppingBag } from "lucide-react";

export const allPlayers = [
    {
        name: "mal.eth",
        team: "Crypto Warriors",
        position: "Elite",
        itemType: "fighters",
        price: 3200,
        lastSale: 3000,
        trend: "up",
        image: "/lovable-uploads/ccf83582-74cf-469c-87ba-b50ffa5da6de.png"
    }, {
        name: "Tarragon Southslice",
        team: "Energy Corps",
        position: "Artillery",
        itemType: "fighters",
        price: 2800,
        lastSale: 2650,
        trend: "up",
        image: "/lovable-uploads/cf5abf4c-cf7f-49b7-a830-49343c8d1222.png"
    }, {
        name: "The Irish King",
        team: "Crimson Hawks",
        position: "Striker",
        itemType: "fighters",
        price: 2500,
        lastSale: 2300,
        trend: "up",
        image: "/lovable-uploads/5c3f060f-4c5f-412b-8f27-eb1bebd3dd7d.png"
    }, {
        name: "Ray Del Maestro",
        team: "Space Raiders",
        position: "Elite",
        itemType: "fighters",
        price: 2800,
        lastSale: 2600,
        trend: "up",
        image: "/lovable-uploads/e8b33b1a-410f-4448-9b83-126b8d27f0a9.png"
    }, {
        name: "Jonesy Bones",
        team: "Steel Wolves",
        position: "Tank",
        itemType: "fighters",
        price: 1900,
        lastSale: 2050,
        trend: "down",
        image: "/lovable-uploads/660b5122-5ce8-4f6e-af72-2c607d47ef44.png"
    }, {
        name: "Protest Sign",
        team: "Future Force",
        position: "Mobility",
        itemType: "emotes",
        price: 2200,
        lastSale: 2100,
        trend: "up",
        image: "/lovable-uploads/f9ba9551-eabd-4e1f-a2a9-2eeddc92114d.png"
    }, {
        name: "Aura Farm",
        team: "Future Force",
        position: "Mobility",
        itemType: "emotes",
        price: 1900,
        lastSale: 1850,
        trend: "up",
        image: "/lovable-uploads/74597015-55ed-4190-91df-62af504a7e04.png"
    }, {
        name: "Stani Eagle",
        team: "Thunder Birds",
        position: "Speed",
        itemType: "fighters",
        price: 1800,
        lastSale: 1650,
        trend: "up",
        image: "/lovable-uploads/37f256dc-415c-4032-82ad-db63f676284d.png"
    }, {
        name: "Screen Smash",
        team: "Future Force",
        position: "Mobility",
        itemType: "emotes",
        price: 1700,
        lastSale: 1650,
        trend: "up",
        image: "/lovable-uploads/f747341c-eccd-47c4-8290-0451629ec3a4.png"
    }, {
        name: "Latin Legend",
        team: "Mountain Lions",
        position: "Defense",
        itemType: "fighters",
        price: 1200,
        lastSale: 1400,
        trend: "down",
        image: "/lovable-uploads/2c556456-ebeb-4eec-9842-f2d31e06c58a.png"
    }, {
        name: "Shane Sonny",
        team: "Ultimate Force",
        position: "Champion",
        itemType: "fighters",
        price: 950,
        lastSale: 1100,
        trend: "down",
        image: "/lovable-uploads/a76e21f1-ffca-4130-bd9a-08d09167dca0.png"
    }, {
        name: "Dumbbell Singer",
        team: "Future Force",
        position: "Mobility",
        itemType: "emotes",
        price: 1200,
        lastSale: 1150,
        trend: "up",
        image: "/lovable-uploads/2c2096de-f308-4a16-865b-31c36a14a080.png"
    }, {
        name: "BMF Shorts",
        team: "Gear Masters",
        position: "Supreme",
        itemType: "accessories",
        price: 1200,
        lastSale: 1150,
        trend: "up",
        image: "/lovable-uploads/6ffd60e7-d39b-442f-a71c-9ae2f491846f.png"
    }, {
        name: "John Strictland",
        team: "Weather Gods",
        position: "Legendary",
        itemType: "fighters",
        price: 1000,
        lastSale: 950,
        trend: "up",
        image: "/lovable-uploads/98664a07-8365-4512-8f3e-a0c79bd4617c.png"
    }, {
        name: "DHB x LCS shorts",
        team: "Gear Masters",
        position: "Supreme",
        itemType: "accessories",
        price: 850,
        lastSale: 950,
        trend: "down",
        image: "/lovable-uploads/e21fe8d7-5519-4b7b-bd90-6b96e74635d4.png"
    }, {
        name: "Combat Vest",
        team: "Gear Masters",
        position: "Supreme",
        itemType: "accessories",
        price: 750,
        lastSale: 850,
        trend: "down",
        image: "/lovable-uploads/8c7fd9f1-1128-4d45-b089-e8879cb0fa98.png"
    }, {
        name: "Rapz Gloves",
        team: "Gear Masters",
        position: "Supreme",
        itemType: "accessories",
        price: 800,
        lastSale: 780,
        trend: "up",
        image: "/lovable-uploads/9320a71d-c3b8-4922-938c-5e759907fcf6.png"
    },
    // Vehicles  
    {
        name: "Pogo",
        team: "Dark Matter",
        position: "Phantom",
        itemType: "mobility",
        price: 8000,
        lastSale: 7500,
        trend: "up",
        image: "/lovable-uploads/2877ff38-b9fd-4a5d-bca9-25b14f237997.png"
    }, {
        name: "The Coupé Tank",
        team: "Neon Guardians",
        position: "Stealth",
        itemType: "mobility",
        price: 5000,
        lastSale: 4800,
        trend: "up",
        image: "/lovable-uploads/1c6b707c-97a6-4381-bc54-de63a7cf8a31.png"
    }, {
        name: "Pit Bike",
        team: "Wind Riders",
        position: "Force",
        itemType: "mobility",
        price: 4500,
        lastSale: 4200,
        trend: "up",
        image: "/lovable-uploads/2d5ccc85-d9e9-4c45-b684-159b0bb83745.png"
    }, {
        name: "Speed Buggy",
        team: "Flame Dragons",
        position: "Assault",
        itemType: "mobility",
        price: 3200,
        lastSale: 3000,
        trend: "up",
        image: "/lovable-uploads/b64d7801-1284-4763-b115-ca3cfa8ff315.png"
    },
    // Emotes
    {
        name: "Squeaky Dance",
        team: "Future Force",
        position: "Mobility",
        itemType: "emotes",
        price: 2500,
        lastSale: 2300,
        trend: "up",
        image: "/lovable-uploads/5c8c027e-3baf-4550-96a9-ba0715d11506.png"
    }, {
        name: "Fists Up",
        team: "Future Force",
        position: "Mobility",
        itemType: "emotes",
        price: 1800,
        lastSale: 1650,
        trend: "up",
        image: "/lovable-uploads/370bd874-ad5c-467d-b844-55688b1a0f9a.png"
    }, {
        name: "u want sum?",
        team: "Future Force",
        position: "Mobility",
        itemType: "emotes",
        price: 1500,
        lastSale: 1400,
        trend: "up",
        image: "/lovable-uploads/30d419b4-79a9-459c-b37b-42099ffd6273.png"
    }, {
        name: "Flex",
        team: "Future Force",
        position: "Mobility",
        itemType: "emotes",
        price: 800,
        lastSale: 750,
        trend: "up",
        image: "/lovable-uploads/f52e83c2-28b7-417e-90ac-757255d1759f.png"
    },
    // Packs
    // {
    //   name: "Wild West Pack",
    //   team: "Pack Masters",
    //   position: "Supreme",
    //   itemType: "packs",
    //   price: 5000,
    //   lastSale: 4800,
    //   trend: "up",
    //   image: "/lovable-uploads/5cf8ad93-f292-4e4c-b53c-eb0c4bc0f7be.png"
    // }, 
    //{
    //   name: "EO Summer Pack",
    //   team: "Pack Masters",
    //   position: "Supreme",
    //   itemType: "packs",
    //   price: 3500,
    //   lastSale: 3300,
    //   trend: "up",
    //   image: "/lovable-uploads/2149e9ad-919f-49ea-8be4-90f190387d39.png"
    // }, {
    //   name: "Gold Pack",
    //   team: "Pack Masters",
    //   position: "Supreme",
    //   itemType: "packs",
    //   price: 2000,
    //   lastSale: 1900,
    //   trend: "up",
    //   image: "/lovable-uploads/291c5734-f144-47b0-9f49-915999e921b0.png"
    // }, {
    //   name: "Silver Pack",
    //   team: "Pack Masters",
    //   position: "Supreme",
    //   itemType: "packs",
    //   price: 1000,
    //   lastSale: 950,
    //   trend: "up",
    //   image: "/lovable-uploads/17c3a939-bcaa-4cdb-9b61-271b5774c7e2.png"
    // },
    // Accessories
    {
        name: "White Base Vest",
        team: "Gear Masters",
        position: "Supreme",
        itemType: "accessory",
        price: 750,
        lastSale: 700,
        trend: "up",
        image: "/lovable-uploads/508d1509-e761-46c6-9f3a-f70e256f5a52.png"
    }, {
        name: "Red Wing Suit",
        team: "Gear Masters",
        position: "Supreme",
        itemType: "accessory",
        price: 600,
        lastSale: 580,
        trend: "up",
        image: "/lovable-uploads/2eec4a9a-97d3-4ba4-9508-2eeef0011139.png"
    }, {
        name: "Grey Base Vest",
        team: "Gear Masters",
        position: "Supreme",
        itemType: "accessory",
        price: 550,
        lastSale: 520,
        trend: "up",
        image: "/lovable-uploads/91375d1a-e829-4716-b3b6-833b58355bd9.png"
    }, {
        name: "Blue Wing Suit",
        team: "Gear Masters",
        position: "Supreme",
        itemType: "accessory",
        price: 450,
        lastSale: 430,
        trend: "up",
        image: "/lovable-uploads/1efc1553-007a-4b38-a982-79d9f5abbfa1.png"
    }
]
export const trendingPlayersData = {
    daily: [{
        name: "The Irish King",
        team: "Crimson Hawks",
        position: "Striker",
        price: 4300,
        change: 12.5,
        trend: "up",
        image: "/lovable-uploads/5c3f060f-4c5f-412b-8f27-eb1bebd3dd7d.png"
    }, {
        name: "Jonesy Bones",
        team: "Steel Wolves",
        position: "Tank",
        price: 3800,
        change: -8.3,
        trend: "down",
        image: "/lovable-uploads/660b5122-5ce8-4f6e-af72-2c607d47ef44.png"
    }, {
        name: "Stani Eagle",
        team: "Thunder Birds",
        position: "Speed",
        price: 4700,
        change: 15.7,
        trend: "up",
        image: "/lovable-uploads/37f256dc-415c-4032-82ad-db63f676284d.png"
    }, {
        name: "Latin Legend",
        team: "Mountain Lions",
        position: "Defense",
        price: 3500,
        change: -4.2,
        trend: "down",
        image: "/lovable-uploads/2c556456-ebeb-4eec-9842-f2d31e06c58a.png"
    }, {
        name: "Speed Buggy",
        team: "Flame Dragons",
        position: "Assault",
        price: 4600,
        change: 9.6,
        trend: "up",
        image: "/lovable-uploads/b64d7801-1284-4763-b115-ca3cfa8ff315.png"
    }],
    weekly: [{
        name: "Silverborg",
        team: "Thunder Hawks",
        position: "Speed",
        price: 4700,
        change: 45.2,
        trend: "up",
        image: "/lovable-uploads/fdd396d6-16bd-493f-ba2e-0c27e846ea03.png"
    }, {
        name: "Based Chad",
        team: "Steel Warriors",
        position: "Tank",
        price: 4200,
        change: 38.7,
        trend: "up",
        image: "/lovable-uploads/335b4baf-29e6-4895-a2d4-54e4cee9fae5.png"
    }, {
        name: "Leroy Girthy",
        team: "Fire Eagles",
        position: "Assault",
        price: 3900,
        change: 33.1,
        trend: "up",
        image: "/lovable-uploads/55728a6c-0c6b-4217-82d8-a21b16e912d6.png"
    }, {
        name: "Big Dawg",
        team: "Ice Wolves",
        position: "Control",
        price: 4500,
        change: 29.8,
        trend: "up",
        image: "/lovable-uploads/2532e628-0d4b-465e-b350-e49def10eb26.png"
    }, {
        name: "Zombie Chan",
        team: "Ground Force",
        position: "Heavy",
        price: 3600,
        change: 27.3,
        trend: "up",
        image: "/lovable-uploads/82fe8aed-6cfa-45b6-945c-c447349b7fe2.png"
    }],
    monthly: [{
        name: "DJ Mouse",
        team: "Mega Corps",
        position: "Destroyer",
        price: 4800,
        change: 89.4,
        trend: "up",
        image: "/lovable-uploads/b86689f4-6c8c-4f7f-91f0-c36052c824e6.png"
    }, {
        name: "Alex Toosick",
        team: "Dark Legion",
        position: "Assassin",
        price: 4300,
        change: 76.8,
        trend: "up",
        image: "/lovable-uploads/fa6496ee-f2e7-4af5-8205-7445121d8a6a.png"
    }, {
        name: "Tarragon Southslice",
        team: "Energy Corps",
        position: "Artillery",
        price: 3700,
        change: 69.5,
        trend: "up",
        image: "/lovable-uploads/cf5abf4c-cf7f-49b7-a830-49343c8d1222.png"
    }, {
        name: "Ray Del Maestro",
        team: "Space Raiders",
        position: "Elite",
        price: 4100,
        change: 62.1,
        trend: "up",
        image: "/lovable-uploads/e8b33b1a-410f-4448-9b83-126b8d27f0a9.png"
    }, {
        name: "John Strictland",
        team: "Weather Gods",
        position: "Legendary",
        price: 4900,
        change: 58.7,
        trend: "up",
        image: "/lovable-uploads/98664a07-8365-4512-8f3e-a0c79bd4617c.png"
    }],
    "all time": [{
        name: "Shane Sonny",
        team: "Ultimate Force",
        position: "Champion",
        price: 4600,
        change: 234.7,
        trend: "up",
        image: "/lovable-uploads/a76e21f1-ffca-4130-bd9a-08d09167dca0.png"
    }, {
        name: "Lean Chad",
        team: "Divine Army",
        position: "Mythic",
        price: 3800,
        change: 189.3,
        trend: "up",
        image: "/lovable-uploads/a266b13a-b169-41bf-92db-c75cf3d91c9e.png"
    }, {
        name: "Indi",
        team: "Cosmic Force",
        position: "Godlike",
        price: 4400,
        change: 156.8,
        trend: "up",
        image: "/lovable-uploads/76adb888-cbfd-4b1c-ba39-36303e53c2c0.png"
    }, {
        name: "Kayne Famooser",
        team: "Quantum Lords",
        position: "Transcendent",
        price: 3500,
        change: 142.5,
        trend: "up",
        image: "/lovable-uploads/89c54fc5-22f2-44fd-bbf1-d90a653fdb22.png"
    }, {
        name: "White Base Vest",
        team: "Eternal Guardians",
        position: "Supreme",
        price: 5000,
        change: 198.9,
        trend: "up",
        image: "/lovable-uploads/508d1509-e761-46c6-9f3a-f70e256f5a52.png"
    }]
};
export const topGainersData = {
    daily: [{
        name: "The Coupé Tank",
        team: "Neon Guardians",
        position: "Stealth",
        price: 5200,
        change: 24.8,
        image: "/lovable-uploads/1c6b707c-97a6-4381-bc54-de63a7cf8a31.png"
    }, {
        name: "Flex",
        team: "Future Force",
        position: "Mobility",
        price: 4800,
        change: 19.3,
        image: "/lovable-uploads/f52e83c2-28b7-417e-90ac-757255d1759f.png"
    }, {
        name: "Pogo",
        team: "Dark Matter",
        position: "Phantom",
        price: 6100,
        change: 17.5,
        image: "/lovable-uploads/2877ff38-b9fd-4a5d-bca9-25b14f237997.png"
    }, {
        name: "Blue Wing Suit",
        team: "Sun Blazers",
        position: "Energy",
        price: 5500,
        change: 16.2,
        image: "/lovable-uploads/1efc1553-007a-4b38-a982-79d9f5abbfa1.png"
    }, {
        name: "Pit Bike",
        team: "Wind Riders",
        position: "Force",
        price: 4900,
        change: 15.9,
        image: "/lovable-uploads/2d5ccc85-d9e9-4c45-b684-159b0bb83745.png"
    }],
    weekly: [{
        name: "Silverborg",
        team: "Thunder Hawks",
        position: "Speed",
        price: 4700,
        change: 45.2,
        image: "/lovable-uploads/fdd396d6-16bd-493f-ba2e-0c27e846ea03.png"
    }, {
        name: "Based Chad",
        team: "Steel Warriors",
        position: "Tank",
        price: 4200,
        change: 38.7,
        image: "/lovable-uploads/335b4baf-29e6-4895-a2d4-54e4cee9fae5.png"
    }, {
        name: "Leroy Girthy",
        team: "Fire Eagles",
        position: "Assault",
        price: 3900,
        change: 33.1,
        image: "/lovable-uploads/55728a6c-0c6b-4217-82d8-a21b16e912d6.png"
    }, {
        name: "Big Dawg",
        team: "Ice Wolves",
        position: "Control",
        price: 4500,
        change: 29.8,
        image: "/lovable-uploads/2532e628-0d4b-465e-b350-e49def10eb26.png"
    }, {
        name: "Zombie Chan",
        team: "Ground Force",
        position: "Heavy",
        price: 3600,
        change: 27.3,
        image: "/lovable-uploads/82fe8aed-6cfa-45b6-945c-c447349b7fe2.png"
    }],
    monthly: [{
        name: "DJ Mouse",
        team: "Mega Corps",
        position: "Destroyer",
        price: 4800,
        change: 89.4,
        image: "/lovable-uploads/b86689f4-6c8c-4f7f-91f0-c36052c824e6.png"
    }, {
        name: "Alex Toosick",
        team: "Dark Legion",
        position: "Assassin",
        price: 4300,
        change: 76.8,
        image: "/lovable-uploads/fa6496ee-f2e7-4af5-8205-7445121d8a6a.png"
    }, {
        name: "Tarragon Southslice",
        team: "Energy Corps",
        position: "Artillery",
        price: 3700,
        change: 69.5,
        image: "/lovable-uploads/cf5abf4c-cf7f-49b7-a830-49343c8d1222.png"
    }, {
        name: "Ray Del Maestro",
        team: "Space Raiders",
        position: "Elite",
        price: 4100,
        change: 62.1,
        image: "/lovable-uploads/e8b33b1a-410f-4448-9b83-126b8d27f0a9.png"
    }, {
        name: "John Strictland",
        team: "Weather Gods",
        position: "Legendary",
        price: 4900,
        change: 58.7,
        image: "/lovable-uploads/98664a07-8365-4512-8f3e-a0c79bd4617c.png"
    }],
    alltime: [{
        name: "Shane Sonny",
        team: "Ultimate Force",
        position: "Champion",
        price: 4600,
        change: 234.7,
        image: "/lovable-uploads/a76e21f1-ffca-4130-bd9a-08d09167dca0.png"
    }, {
        name: "Lean Chad",
        team: "Divine Army",
        position: "Mythic",
        price: 3800,
        change: 189.3,
        image: "/lovable-uploads/a266b13a-b169-41bf-92db-c75cf3d91c9e.png"
    }, {
        name: "Indi",
        team: "Cosmic Force",
        position: "Godlike",
        price: 4400,
        change: 156.8,
        image: "/lovable-uploads/76adb888-cbfd-4b1c-ba39-36303e53c2c0.png"
    }, {
        name: "Kayne Famooser",
        team: "Quantum Lords",
        position: "Transcendent",
        price: 3500,
        change: 142.5,
        image: "/lovable-uploads/89c54fc5-22f2-44fd-bbf1-d90a653fdb22.png"
    }, {
        name: "White Base Vest",
        team: "Eternal Guardians",
        position: "Supreme",
        price: 5000,
        change: 198.9,
        image: "/lovable-uploads/508d1509-e761-46c6-9f3a-f70e256f5a52.png"
    }]
};

export const tabItems = [{
    id: "home",
    label: "Home",
    icon: Home
}, {
    id: "store",
    label: "Store",
    icon: ShoppingBag
}, {
    id: "market",
    label: "Market",
    icon: Handshake
}, {
    id: "locker",
    label: "Locker",
    icon: Archive
}, {
    id: "lobby",
    label: "Lobby",
    icon: Gamepad
}, {
    id: "coins",
    label: "Coins",
    icon: Coins
}];