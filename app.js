const {
  useCallback,
  useEffect,
  useRef,
  useState
} = React;
const {
  Button,
  Divider,
  Grid,
  Input,
  Transition
} = semanticUIReact;
const DATA_NAME = 'LostArkData';
const RESET_UTC_OFFSET = -10;
const RESET_DAY = 3;
const encode = obj => {
  return JSON.stringify(obj);
};
const decode = str => {
  return str ? JSON.parse(str) : DEFAULT_DATA;
};
const storeData = (name, data) => {
  localStorage.setItem(name, data);
};
const getData = name => {
  return localStorage.getItem(name);
};
const getDay = () => {
  var d = new Date();
  d.setHours(d.getHours() + RESET_UTC_OFFSET);
  return d.getUTCDay();
};
const getRestFromPoints = (left, right, point) => {
  return Math.round((Math.min(Math.max(point, left), right) - left) / (right - left) * 10);
};
const calculateRest = (rest, checked) => {
  return Math.min(rest - Math.min(Math.floor(rest / 2), checked.filter(Boolean).length) * 2, 10);
};
const calculateNewRest = (rest, checked, total) => {
  const numChecked = checked.filter(Boolean).length;
  return Math.min(rest - Math.min(Math.floor(rest / 2), numChecked * 2) + total - numChecked, 10);
};
const incrementDay = (data, day) => {
  return {
    ...data,
    day: day,
    characters: data.characters.map(c => {
      return {
        ...c,
        daily: Object.fromEntries(Object.entries({
          ...Object.fromEntries(data.daily.filter(config => config.restable).map(config => [config.key, {
            rest: 0
          }])),
          ...c.daily
        }).map(([key, {
          checked,
          rest,
          ...char
        }]) => {
          const daily = data.daily.find(config => config.key === key);
          return [key, {
            ...char,
            ...(daily?.restable && {
              rest: calculateNewRest(rest ?? 0, checked ?? [], daily.number)
            })
          }];
        })),
        weekly: day === RESET_DAY ? Object.fromEntries(Object.entries(c.weekly ?? {}).map(([key, {
          checked,
          ...char
        }]) => {
          return [key, {
            ...char
          }];
        })) : c.weekly,
        shops: day === RESET_DAY ? Object.fromEntries(Object.entries(c.shops ?? {}).map(([key, {
          checked,
          ...char
        }]) => {
          return [key, {
            ...char
          }];
        })) : c.shops
      };
    }),
    daily: data.daily.map(({
      checked,
      ...config
    }) => {
      return {
        ...config
      };
    }),
    weekly: day === RESET_DAY ? data.weekly.map(({
      checked,
      ...config
    }) => {
      return {
        ...config
      };
    }) : data.weekly,
    shops: day === RESET_DAY ? data.shops.map(({
      checked,
      ...config
    }) => {
      return {
        ...config
      };
    }) : data.shops
  };
};
const GlobalButtons = ({
  data,
  setData,
  editing,
  setEditing,
  addCharacter
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [newCharOpen, setNewCharOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [error, setError] = useState(false);
  const newCharRef = useRef(null);
  const uploadRef = useRef(null);
  const testData = str => {
    try {
      decode(str);
      setError(false);
      return true;
    } catch (_) {
      setError(true);
      return false;
    }
  };
  const loadData = str => {
    setData({
      day: getDay(),
      ...decode(str)
    });
    setError(false);
    setUploadOpen(false);
  };
  useEffect(() => {
    if (newCharOpen) {
      newCharRef.current.inputRef.current.value = '';
      newCharRef.current.focus();
    }
  }, [newCharOpen]);
  useEffect(() => {
    if (uploadOpen) {
      setError(false);
      uploadRef.current.inputRef.current.value = '';
      uploadRef.current.focus();
    }
  }, [uploadOpen]);
  return /*#__PURE__*/React.createElement("div", {
    className: "global-buttons"
  }, /*#__PURE__*/React.createElement("div", {
    className: "button"
  }, /*#__PURE__*/React.createElement(Button, {
    basic: true,
    inverted: true,
    circular: true,
    icon: menuOpen ? 'close' : 'bars',
    onClick: () => {
      if (menuOpen) {
        setMenuOpen(false);
        setEditing(false);
        setNewCharOpen(false);
        setCopyOpen(false);
        setUploadOpen(false);
      } else {
        setMenuOpen(true);
      }
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "button"
  }, /*#__PURE__*/React.createElement(Transition, {
    visible: menuOpen,
    animation: "fade down",
    duration: 300
  }, /*#__PURE__*/React.createElement(Button, {
    className: editing ? 'active' : '',
    basic: true,
    inverted: true,
    circular: true,
    icon: "setting",
    onClick: () => {
      setUploadOpen(false);
      setNewCharOpen(false);
      setEditing(!editing);
    }
  })), /*#__PURE__*/React.createElement(Transition, {
    visible: editing,
    animation: "fade right",
    duration: 300
  }, /*#__PURE__*/React.createElement(Button, {
    className: "popup-button",
    basic: true,
    inverted: true,
    circular: true,
    icon: "plus",
    onClick: () => {
      setUploadOpen(false);
      setNewCharOpen(true);
    }
  })), /*#__PURE__*/React.createElement(Transition, {
    visible: editing && newCharOpen,
    animation: "fade right",
    duration: 300
  }, /*#__PURE__*/React.createElement("div", {
    className: "popup"
  }, /*#__PURE__*/React.createElement(Input, {
    ref: newCharRef,
    transparent: true,
    inverted: true,
    placeholder: "Name",
    onKeyDown: e => {
      if (e.key === 'Enter' && e.target.value !== '') {
        addCharacter(e.target.value);
        setNewCharOpen(false);
      }
      e.key === 'Escape' && setNewCharOpen(false);
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "button"
  }, /*#__PURE__*/React.createElement(Transition, {
    visible: menuOpen,
    animation: "fade down",
    duration: 300
  }, /*#__PURE__*/React.createElement(Button, {
    basic: true,
    inverted: true,
    circular: true,
    icon: "copy",
    onClick: () => {
      setNewCharOpen(false);
      setUploadOpen(false);
      setCopyOpen(true);
      setTimeout(() => setCopyOpen(false), 3000);
      navigator.clipboard.writeText(getData(DATA_NAME));
    }
  })), /*#__PURE__*/React.createElement(Transition, {
    visible: copyOpen,
    animation: "fade right",
    duration: 300
  }, /*#__PURE__*/React.createElement("div", {
    className: "popup"
  }, "Config copied to clipboard!"))), /*#__PURE__*/React.createElement("div", {
    className: "button"
  }, /*#__PURE__*/React.createElement(Transition, {
    visible: menuOpen,
    animation: "fade down",
    duration: 300
  }, /*#__PURE__*/React.createElement(Button, {
    className: uploadOpen ? 'active' : '',
    basic: true,
    inverted: true,
    circular: true,
    icon: "upload",
    onClick: () => {
      setNewCharOpen(false);
      setUploadOpen(!uploadOpen);
    }
  })), /*#__PURE__*/React.createElement(Transition, {
    visible: uploadOpen,
    animation: "fade right",
    duration: 300
  }, /*#__PURE__*/React.createElement("div", {
    className: `popup ${error ? 'error' : ''}`
  }, /*#__PURE__*/React.createElement(Input, {
    ref: uploadRef,
    transparent: true,
    inverted: true,
    placeholder: "Config",
    onChange: e => {
      testData(e.target.value);
    },
    onKeyDown: e => {
      e.key === 'Enter' && e.target.value !== '' && testData(e.target.value) && loadData(e.target.value);
      e.key === 'Escape' && setUploadOpen(false);
    }
  }), /*#__PURE__*/React.createElement("a", {
    onClick: () => {
      loadData('');
    }
  }, "RESET")))));
};
const Checkbox = ({
  color,
  checked,
  disabled,
  editing,
  onClick
}) => {
  const checkboxStyle = {
    color: checked && !editing ? color : 'transparent',
    boxShadow: checked && !editing ? '0 0 0 2px transparent inset' : disabled ? '0 0 0 2px rgb(40, 40, 40) inset' : `0 0 0 2px ${color} inset`
  };
  return /*#__PURE__*/React.createElement(Button, {
    className: "check",
    circular: true,
    icon: "check",
    style: checkboxStyle,
    onClick: onClick
  });
};
const Checkboxes = ({
  color,
  checked,
  disabled,
  restable,
  rest,
  editing,
  dragging,
  setDragging,
  setChecked,
  setDisabled,
  setRest
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, checked.map((c, i) => /*#__PURE__*/React.createElement(Checkbox, {
    key: i,
    color: color,
    checked: c,
    disabled: disabled[i],
    editing: editing,
    onClick: () => {
      editing ? setDisabled(disabled.map((oldD, j) => i === j ? !oldD : oldD)) : setChecked(checked.map((oldC, j) => i === j ? !oldC : oldC));
    }
  })), restable && /*#__PURE__*/React.createElement("div", {
    className: `rest ${editing ? 'editing' : ''}`,
    onMouseDown: e => {
      if (editing && !dragging) {
        e.preventDefault();
        setDragging(true);
        const left = e.currentTarget.getBoundingClientRect().left;
        const right = e.currentTarget.getBoundingClientRect().right;
        setRest(getRestFromPoints(left, right, e.clientX));
        const handleMouseMove = e => {
          e.preventDefault();
          setRest(getRestFromPoints(left, right, e.clientX));
        };
        const handleMouseUp = e => {
          e.preventDefault();
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
          setRest(getRestFromPoints(left, right, e.clientX));
          setDragging(false);
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
      }
    }
  }, [...Array(10)].map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "rest-bar",
    style: {
      backgroundColor: i < calculateRest(rest, checked) ? color : 'rgb(40, 40, 40)'
    }
  }))));
};
const CharacterRow = ({
  characters,
  editing,
  setCharacterConfig,
  removeCharacter
}) => {
  return /*#__PURE__*/React.createElement(Grid.Row, {
    className: "column-title"
  }, /*#__PURE__*/React.createElement(Grid.Column, {
    className: "row-title"
  }), characters.map((c, i) => /*#__PURE__*/React.createElement(Grid.Column, {
    key: i
  }, editing ? /*#__PURE__*/React.createElement(Input, {
    transparent: true,
    inverted: true,
    className: "centered",
    value: c.name,
    onChange: e => {
      setCharacterConfig(i, {
        ...c,
        name: e.target.value
      });
    },
    onKeyDown: e => {
      e.key === 'Enter' && e.target.value === '' && characters.length > 1 && removeCharacter(i);
    }
  }) : c.name)));
};
const DataRow = ({
  type,
  day,
  config,
  characters,
  editing,
  setCharacterConfig,
  setRosterConfig,
  dragging,
  setDragging
}) => {
  const color = config.color ?? 'white';
  const numCheckboxes = config.days ? config.days.map(d => d[day]).filter(Boolean).length : config.number ?? 1;
  return numCheckboxes > 0 ? /*#__PURE__*/React.createElement(Grid.Row, null, /*#__PURE__*/React.createElement(Grid.Column, {
    className: "row-title",
    textAlign: "left"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: color
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "task-icon",
    src: config.img
  }), config.name)), config.roster ? /*#__PURE__*/React.createElement(Grid.Column, null, /*#__PURE__*/React.createElement(Checkboxes, {
    color: color,
    checked: config.checked ?? [...Array(numCheckboxes).fill(false)],
    disabled: [...Array(numCheckboxes).fill(false)],
    restable: false,
    rest: 0,
    editing: false,
    setChecked: newChecked => {
      setRosterConfig({
        ...config,
        checked: newChecked
      });
    }
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, characters.map((c, i) => /*#__PURE__*/React.createElement(Grid.Column, {
    key: i
  }, /*#__PURE__*/React.createElement(Checkboxes, {
    color: color,
    checked: c[type]?.[config.key]?.checked ?? [...Array(numCheckboxes).fill(false)],
    disabled: [...Array(numCheckboxes)].map((_, j) => {
      return c[type]?.[config.key]?.todo === 'rested' ? editing ? true : (c[type]?.[config.key]?.rest ?? 0) < 2 * config.number : c[type]?.[config.key]?.todo < j + 1;
    }),
    restable: config.restable,
    rest: c[type]?.[config.key]?.rest ?? 0,
    editing: editing,
    dragging: dragging,
    setDragging: setDragging,
    setChecked: newChecked => {
      setCharacterConfig(i, {
        ...c,
        [type]: {
          ...c[type],
          [config.key]: {
            ...c[type]?.[config.key],
            checked: newChecked
          }
        }
      });
    },
    setDisabled: newDisabled => {
      const numTodo = numCheckboxes - newDisabled.filter(Boolean).length;
      setCharacterConfig(i, {
        ...c,
        [type]: {
          ...c[type],
          [config.key]: {
            ...c[type]?.[config.key],
            todo: config.restable && numTodo === 0 ? 'rested' : numTodo
          }
        }
      });
    },
    setRest: newRest => {
      config.restable && setCharacterConfig(i, {
        ...c,
        [type]: {
          ...c[type],
          [config.key]: {
            ...c[type]?.[config.key],
            rest: newRest
          }
        }
      });
    }
  }))))) : /*#__PURE__*/React.createElement(React.Fragment, null);
};
const Table = ({
  data,
  setData,
  editing
}) => {
  const [dragging, setDragging] = useState(false);
  const {
    day,
    characters,
    daily,
    weekly,
    shops
  } = data;
  const setRosterConfig = (type, index, newConfig) => {
    setData({
      ...data,
      [type]: data[type].map((c, i) => i === index ? newConfig : c)
    });
  };
  const setCharacterConfig = (index, newChar) => {
    setData({
      ...data,
      characters: characters.map((c, i) => i === index ? newChar : c)
    });
  };
  const removeCharacter = index => {
    setData({
      ...data,
      characters: characters.filter((_, i) => i !== index)
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "table-container"
  }, /*#__PURE__*/React.createElement(Grid, {
    inverted: true,
    columns: "equal",
    textAlign: "center",
    verticalAlign: "middle",
    padded: "horizontally"
  }, /*#__PURE__*/React.createElement(CharacterRow, {
    characters,
    editing,
    setCharacterConfig,
    removeCharacter
  }), daily.map((config, i) => /*#__PURE__*/React.createElement(DataRow, {
    key: i,
    type: "daily",
    day,
    config,
    characters,
    editing,
    setCharacterConfig,
    setRosterConfig: newConfig => {
      setRosterConfig('daily', i, newConfig);
    },
    dragging,
    setDragging
  })), /*#__PURE__*/React.createElement(Divider, null), weekly.map((config, i) => /*#__PURE__*/React.createElement(DataRow, {
    key: i,
    type: "weekly",
    day,
    config,
    characters,
    editing,
    setCharacterConfig,
    setRosterConfig: newConfig => {
      setRosterConfig('weekly', i, newConfig);
    }
  })), /*#__PURE__*/React.createElement(Divider, null), shops.map((config, i) => /*#__PURE__*/React.createElement(DataRow, {
    key: i,
    type: "shops",
    day,
    config,
    characters,
    editing,
    setCharacterConfig,
    setRosterConfig: newConfig => {
      setRosterConfig('shops', i, newConfig);
    }
  }))));
};
const App = () => {
  const [data, _setData] = useState({
    day: getDay(),
    ...decode(getData(DATA_NAME))
  });
  const [editing, setEditing] = useState(false);
  const setData = d => {
    _setData(d);
    storeData(DATA_NAME, encode(d));
  };
  const testDay = useCallback(() => {
    const newDay = getDay();
    if (newDay !== data.day) {
      setData(incrementDay(data, newDay));
    }
  }, [data]);
  useEffect(() => {
    testDay();
    const timer = setTimeout(() => {
      testDay();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [testDay]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(GlobalButtons, {
    data,
    setData,
    editing,
    setEditing,
    addCharacter: name => {
      setData({
        ...data,
        characters: [...data.characters, {
          name: name
        }]
      });
    }
  }), /*#__PURE__*/React.createElement(Table, {
    data,
    setData,
    editing
  }));
};
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render( /*#__PURE__*/React.createElement(App, null));
