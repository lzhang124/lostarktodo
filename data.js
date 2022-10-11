const DEFAULT_DATA = {
  characters: [
    {
      name: 'Miyunaa',
    },
    {
      name: 'Polelanceress',
      daily: {
        chaos: {
          todo: 1,
        },
        guardian: {
          todo: 1,
        }
      },
    },
    {
      name: 'Pinkrosé',
      daily: {
        chaos: {
          todo: 1,
        },
        guardian: {
          todo: 1,
        }
      },
      weekly: {
        kakul: {
          todo: 0,
        },
      },
    },
    {
      name: 'Catashetrophe',
      daily: {
        chaos: {
          todo: 1,
        },
        guardian: {
          todo: 1,
        }
      },
      weekly: {
        kakul: {
          todo: 0,
        },
      },
    },
    {
      name: 'Royalblush',
      daily: {
        chaos: {
          todo: 1,
        },
        guardian: {
          todo: 1,
        }
      },
      weekly: {
        kakul: {
          todo: 0,
        },
      },
    },
    {
      name: 'Healingblue',
      daily: {
        chaos: {
          todo: 1,
        },
        guardian: {
          todo: 1,
        }
      },
      weekly: {
        kakul: {
          todo: 0,
        },
      },
    },
    {
      name: 'Yuukitorii',
      daily: {
        chaos: {
          todo: 1,
        },
        guardian: {
          todo: 1,
        }
      },
      weekly: {
        kakul: {
          todo: 0,
        },
      },
    },
    {
      name: 'Otwodarling',
      daily: {
        chaos: {
          todo: 1,
        },
        guardian: {
          todo: 1,
        }
      },
      weekly: {
        kakul: {
          todo: 0,
        },
      },
    },
  ],
  daily: [
    {
      name: 'Guild Donation',
      key: 'guild',
      img: 'img/guild.png',
    },
    {
      name: 'Una\'s Task',
      key: 'una',
      img: 'img/una_daily.png',
      color: '#8bc34a',
      number: 3,
      restable: true,
    },
    {
      name: 'Chaos Dungeon',
      key: 'chaos',
      img: 'img/chaos_dungeon.png',
      color: '#ffc107',
      number: 2,
      restable: true,
    },
    {
      name: 'Guardian Raid',
      key: 'guardian',
      img: 'img/guardian_raid.png',
      color: '#d65e5e',
      number: 2,
      restable: true,
    },
    {
      name: 'Rapport',
      key: 'rapport',
      img: 'img/rapport.png',
      color: '#d171b5',
      number: 6,
      roster: true,
    },
    {
      name: 'Adventure Island',
      key: 'adventure',
      img: 'img/adventure_island.png',
      color: '#b05ebf',
      days: [[true, true, true, true, true, true, true], [true, false, false, false, false, false, true]],
      roster: true,
    },
    {
      name: 'Chaos Gate',
      key: 'gate',
      img: 'img/chaos_gate.png',
      color: '#9160e6',
      days: [[true, true, false, false, true, false, true]],
      roster: true,
    },
    {
      name: 'Field Boss',
      key: 'field',
      img: 'img/field_boss.png',
      color: '#d65e5e',
      days: [[true, false, true, false, false, true, false]],
      roster: true,
    },
  ],
  weekly: [
    {
      name: 'Guild Task',
      key: 'guild',
      img: 'img/guild.png',
      number: 3,
    },
    {
      name: 'Una\'s Task',
      key: 'una',
      img: 'img/una_weekly.png',
      color: '#5874db',
      number: 3,
    },
    {
      name: 'Event Guardian',
      key: 'event',
      img: 'img/guardian_raid.png',
      color: '#d65e5e',
    },
    {
      name: 'Kakul Saydon',
      key: 'kakul',
      img: 'img/legion_raid.png',
      color: '#3c93d6',
    },
    {
      name: 'Vykas',
      key: 'vykas',
      img: 'img/legion_raid.png',
      color: '#3c93d6',
    },
    {
      name: 'Valtan',
      key: 'valtan',
      img: 'img/legion_raid.png',
      color: '#3c93d6',
    },
    {
      name: 'Argos',
      key: 'argos',
      img: 'img/abyss_raid.png',
      color: '#366ae3',
    },
    {
      name: 'Challenge Guardian',
      key: 'guardian',
      img: 'img/guardian_raid.png',
      color: '#d65e5e',
      number: 3,
      roster: true,
    },
    {
      name: 'Challenge Abyss',
      key: 'abyss',
      img: 'img/abyss_dungeon.png',
      color: '#3c93d6',
      roster: true,
    },
    {
      name: 'Ghostship',
      key: 'ghostship',
      img: 'img/ghostship.png',
      color: '#b05ebf',
      roster: true,
    },
  ],
  shops: [
    {
      name: 'Guild',
      key: 'guild',
      img: 'img/bloodstone.png',
    },
    {
      name: 'Pirate',
      key: 'pirate',
      img: 'img/pirate_coin.png',
      color: '#d99548',
    },
    {
      name: 'Event Guardian',
      key: 'event',
      img: 'img/guardian_raid.png',
      color: '#d65e5e',
      roster: true,
    },
    {
      name: 'Rift Piece',
      key: 'rift',
      img: 'img/rift_piece.png',
      color: '#3c93d6',
      roster: true,
    },
  ],
}
