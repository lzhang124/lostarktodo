const { useCallback, useEffect, useState } = React
const { Button, Divider, Grid, Input, Popup } = semanticUIReact

const DATA_NAME = 'LostArkData'
const RESET_UTC_OFFSET = -10
const RESET_DAY = 3

const encode = obj => {
  return JSON.stringify(obj)
}

const decode = str => {
  return str ? JSON.parse(str) : DEFAULT_DATA
}

const storeData = (name, data) => {
  localStorage.setItem(name, data)
}

const getData = name => {
  return localStorage.getItem(name)
}

const getDay = () => {
  var d = new Date()
  d.setHours(d.getHours() + RESET_UTC_OFFSET)
  return d.getUTCDay()
}

const getRestFromPoints = (left, right, point) => {
  return Math.round((Math.min(Math.max(point, left), right) - left) / (right - left) * 10)
}

const calculateRest = (rest, checked) => {
  return Math.min(rest - (Math.min(Math.floor(rest / 2), checked.filter(Boolean).length) * 2), 10)
}

const calculateNewRest = (rest, checked, total) => {
  const numChecked = checked.filter(Boolean).length
  return Math.min(rest - (Math.min(Math.floor(rest / 2), numChecked * 2)) + total - numChecked, 10)
}

const incrementDay = (data, day) => {
  return {
    ...data,
    day: day,
    characters: data.characters.map(c => {
      return {
        ...c,
        daily: Object.fromEntries(Object.entries(c.daily ?? {}).map(([key, {checked, rest, ...char}]) => {
          const daily = data.daily.find(config => config.key === key)
          return [key, {...char, ...(daily?.restable && {rest: calculateNewRest(rest ?? 0, checked ?? [], daily.number)})}]
        })),
        weekly: day === RESET_DAY ? Object.fromEntries(Object.entries(c.weekly ?? {}).map(([key, {checked, ...char}]) => {
          return [key, {...char}]
        })) : c.weekly,
        shops: day === RESET_DAY ? Object.fromEntries(Object.entries(c.shops ?? {}).map(([key, {checked, ...char}]) => {
          return [key, {...char}]
        })) : c.shops,
      }
    }),
    daily: data.daily.map(({checked, ...config}) => {
      return {...config}
    }),
    weekly: day === RESET_DAY ? data.weekly.map(({checked, ...config}) => {
      return {...config}
    }) : data.weekly,
    shops: day === RESET_DAY ? data.shops.map(({checked, ...config}) => {
      return {...config}
    }) : data.shops,
  }
}

const GlobalButtons = ({data, setData, editing, setEditing}) => {
  const [error, setError] = useState(false)
  const [open, setOpen] = useState(false)

  const testData = str => {
    try {
      decode(str)
      setError(false)
      return true
    } catch (_) {
      setError(true)
      return false
    }
  }

  const loadData = str => {
    setData({day: getDay(), ...decode(str)})
    setError(false)
    setOpen(false)
  }

  return (
    <div className='global-buttons'>
      <Button
        className={editing ? 'active' : ''}
        basic
        inverted
        circular
        icon='setting'
        onClick={() => {setEditing(!editing)}}
      />
      <Button
        basic
        inverted
        circular
        icon='copy'
        onClick={() => navigator.clipboard.writeText(getData(DATA_NAME))}
      />
      <Popup
        basic
        inverted
        position='right center'
        open={open}
        trigger={
          <Button
            className={open ? 'active' : ''}
            basic
            inverted
            circular
            icon='upload'
            onClick={() => {setOpen(!open)}}
          />
        }
      >
        <Input
          autoFocus
          transparent
          inverted
          error={error}
          placeholder='Paste checklist...'
          onChange={e => {e.target.value !== '' && testData(e.target.value)}}
          onKeyDown={e => {e.key === 'Enter' && testData(e.target.value) && loadData(e.target.value)}}
        />
      </Popup>
    </div>
  )
}

const Checkbox = ({color, checked, disabled, editing, onClick}) => {
  const checkboxStyle = {
    color: checked && !editing ? color : 'transparent',
    boxShadow: checked && !editing ? '0 0 0 2px transparent inset' : disabled ? '0 0 0 2px rgb(40, 40, 40) inset' : `0 0 0 2px ${color} inset`,
  }

  return (
    <Button
      className='check'
      circular
      icon='check'
      style={checkboxStyle}
      onClick={onClick}
    />
  )
}

const Checkboxes = ({color, checked, disabled, restable, rest, editing, dragging, setDragging, setChecked, setDisabled, setRest}) => {
  return (
    <>
      {checked.map((c, i) => (
        <Checkbox
          key={i}
          color={color}
          checked={c}
          disabled={disabled[i]}
          editing={editing}
          onClick={() => {editing ? setDisabled(disabled.map((oldD, j) => i === j ? !oldD : oldD)) : setChecked(checked.map((oldC, j) => i === j ? !oldC : oldC))}}
        />
      ))}
      {restable && (
        <div
          className={`rest ${editing ? 'editing' : ''}`}
          onMouseDown={e => {
            if (editing && !dragging) {
              e.preventDefault()
              setDragging(true)
              const left = e.currentTarget.getBoundingClientRect().left
              const right = e.currentTarget.getBoundingClientRect().right
              setRest(getRestFromPoints(left, right, e.clientX))

              const handleMouseMove = e => {
                e.preventDefault()
                setRest(getRestFromPoints(left, right, e.clientX))
              }

              const handleMouseUp = e => {
                e.preventDefault()
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
                setRest(getRestFromPoints(left, right, e.clientX))
                setDragging(false)
              }

              window.addEventListener('mousemove', handleMouseMove)
              window.addEventListener('mouseup', handleMouseUp)
            }
          }}
        >
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className='rest-bar'
              style={{backgroundColor: i < calculateRest(rest, checked) ? color : 'rgb(40, 40, 40)'}}
            />
          ))}
        </div>
      )}
    </>
  )
}

const CharacterRow = ({characters}) => {
  return (
    <Grid.Row className='column-title'>
      <Grid.Column className='row-title'>
      </Grid.Column>
      {characters.map(c => (
        <Grid.Column key={c.name}>
          {c.name}
        </Grid.Column>
      ))}
    </Grid.Row>
  )
}

const DataRow = ({type, day, config, characters, editing, setCharacterConfig, setRosterConfig, dragging, setDragging}) => {
  const color = config.color ?? 'white'

  const numCheckboxes = config.days ? config.days.map(d => d[day]).filter(Boolean).length : config.number ?? 1

  return numCheckboxes > 0 ? (
    <Grid.Row>
      <Grid.Column className='row-title' textAlign='left'>
        <div style={{color: color}}>
          <img className='task-icon' src={config.img} />
          {config.name}
        </div>
      </Grid.Column>
      {config.roster ? (
        <Grid.Column>
          <Checkboxes
            color={color}
            checked={config.checked ?? [...Array(numCheckboxes).fill(false)]}
            disabled={[...Array(numCheckboxes).fill(false)]}
            restable={false}
            rest={0}
            editing={false}
            setChecked={newChecked => {setRosterConfig({...config, checked: newChecked})}}
          />
        </Grid.Column>
      ) : (
        <>
          {characters.map((c, i) => (
            <Grid.Column key={c.name}>
              <Checkboxes
                color={color}
                checked={c[type]?.[config.key]?.checked ?? [...Array(numCheckboxes).fill(false)]}
                disabled={[...Array(numCheckboxes)].map((_, j) => {
                  return c[type]?.[config.key]?.todo === 'rested' ? editing ? true : (c[type]?.[config.key]?.rest ?? 0) < 2 * (j + 1) : c[type]?.[config.key]?.todo < j + 1
                })}
                restable={config.restable}
                rest={c[type]?.[config.key]?.rest ?? 0}
                editing={editing}
                dragging={dragging}
                setDragging={setDragging}
                setChecked={newChecked => {
                  setCharacterConfig(i, {
                    ...c,
                    [type]: {
                      ...c[type],
                      [config.key]: {
                        ...c[type]?.[config.key],
                        checked: newChecked,
                      }
                    }
                  })
                }}
                setDisabled={newDisabled => {
                  const numTodo = numCheckboxes - newDisabled.filter(Boolean).length
                  setCharacterConfig(i, {
                    ...c,
                    [type]: {
                      ...c[type],
                      [config.key]: {
                        ...c[type]?.[config.key],
                        todo: config.restable && numTodo === 0 ? 'rested' : numTodo,
                      }
                    }
                  })
                }}
                setRest={newRest => {
                  config.restable && setCharacterConfig(i, {
                    ...c,
                    [type]: {
                      ...c[type],
                      [config.key]: {
                        ...c[type]?.[config.key],
                        rest: newRest,
                      }
                    }
                  })
                }}
              />
            </Grid.Column>
          ))}
        </>
      )}
    </Grid.Row>
  ) : (
    <>
    </>
  )
}

const Table = ({data, setData, editing}) => {
  const [dragging, setDragging] = useState(false)

  const {day, characters, daily, weekly, shops} = data

  const setRosterConfig = (type, index, newConfig) => {
    setData({...data, [type]: data[type].map((c, i) => i === index ? newConfig : c)})
  }

  const setCharacterConfig = (index, newChar) => {
    setData({...data, characters: characters.map((c, i) => i === index ? newChar : c)})
  }

  return (
    <div className='table-container'>
      <Grid inverted columns='equal' textAlign='center' verticalAlign='middle'>
        <CharacterRow {...{characters}} />
        {daily.map((config, i) => (
          <DataRow
            key={config.name}
            type='daily'
            {...{
              day,
              config,
              characters,
              editing,
              setCharacterConfig,
              setRosterConfig: newConfig => {
                setRosterConfig('daily', i, newConfig)
              },
              dragging,
              setDragging,
            }} />
        ))}
        <Divider />
        {weekly.map((config, i) => (
          <DataRow
            key={config.name}
            type='weekly'
            {...{
              day,
              config,
              characters,
              editing,
              setCharacterConfig,
              setRosterConfig: newConfig => {
                setRosterConfig('weekly', i, newConfig)
              },
            }} />
        ))}
        <Divider />
        {shops.map((config, i) => (
          <DataRow
            key={config.name}
            type='shops'
            {...{
              day,
              config,
              characters,
              editing,
              setCharacterConfig,
              setRosterConfig: newConfig => {
                setRosterConfig('shops', i, newConfig)
              },
            }} />
        ))}
      </Grid>
    </div>
  )
}

const App = () => {
  const [data, _setData] = useState({day: getDay(), ...decode(getData(DATA_NAME))})
  const [editing, setEditing] = useState(false)

  const setData = d => {
    _setData(d)
    storeData(DATA_NAME, encode(d))
  }

  const testDay = useCallback(() => {
    const newDay = getDay()
    if (newDay !== data.day) {
      setData(incrementDay(data, newDay))
    }
  }, [data])

  useEffect(() => {
    testDay()
    const timer = setTimeout(() => {
      testDay()
    }, 1000 * 60 * 60);
    return () => {clearTimeout(timer)};
  }, [testDay]);

  return (
    <>
      <GlobalButtons {...{data, setData, editing, setEditing}} />
      <Table {...{data, setData, editing}} />
    </>
  )
}

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container)
root.render(<App />)
