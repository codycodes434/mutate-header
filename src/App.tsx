import { Button, Checkbox, FormControlLabel, IconButton, TextField } from '@mui/material';
import { Delete } from '@mui/icons-material';
import React from 'react';
import './App.css';
import { UserSettings } from './user-settings';
import { getSettings, saveSettings } from './user-settings-helpers';

const getDefaultSettings = () : UserSettings => {
  return { 
    headers: [],
    isActive: true
  };
};

function App() {
  const [ settings, setSettings ] = React.useState(getDefaultSettings());
  const [ isLoading, setLoading ] = React.useState<boolean>(true);

  React.useEffect(() => {
    getSettings()
      .then((loadedSettings) => {
        const settings = loadedSettings?.default;

        if (!settings) return;

        setSettings(JSON.parse(settings));
      })
      .finally(() => setLoading(false));
  }, []);

  const onAddHeader =  () => {
    setSettings({
      ...settings,
      headers: [ ...settings.headers, { name: "", value: "", isActive: true } ]
    });
  };

  const updateHeaderName = (index: number, name: string) => {
    const updatedSettings = {
      ...settings
    };

    updatedSettings.headers[index] = {
      ...updatedSettings.headers[index],
      name
    };

    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };

  const updateHeaderValue =  (index: number, value: string) => {
    const updatedSettings = {
      ...settings
    };

    updatedSettings.headers[index] = {
      ...updatedSettings.headers[index],
      value
    };

    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };

  const updateHeaderActive = (index: number, isChecked: boolean) => {
    const updatedSettings = {
      ...settings
    };

    updatedSettings.headers[index] = {
      ...updatedSettings.headers[index],
      isActive: isChecked
    };

    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };

  const updateAllHeadersActive = (isChecked: boolean) => {
    const updatedSettings = {
      ...settings,
      isActive: isChecked
    };

    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };

  const deleteHeader = (index: number) => {
    const updatedSettings = {
      ...settings,
      headers: settings.headers.filter((_, i) => i !== index)
    };

    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };

  if (isLoading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <div className="view-container">
      <Button
        variant="contained"
        onClick={onAddHeader}
        >
          + Add Header
      </Button>
      <div>
        <FormControlLabel 
          control={
            <Checkbox size="medium" 
              style={{ marginLeft: 0 }}
              checked={settings.isActive} 
              onChange={(e) => updateAllHeadersActive(e.target.checked)} />
          } 
          label="Request Headers:" />
        
        {settings.headers.map(({ name, isActive, value }, i) => {
          return (
            <div className='flex'>
              <Checkbox size="medium" 
                checked={isActive} 
                onChange={(e) => updateHeaderActive(i, e.target.checked)} />
              <TextField 
                size="small" 
                value={name} 
                onChange={(e) => updateHeaderName(i, e.target.value)} /> 
              <TextField 
                size="small" 
                value={value} 
                onChange={(e) => updateHeaderValue(i, e.target.value)}/>
              <IconButton 
                aria-label="delete"
                onClick={() => deleteHeader(i)}>
                <Delete />
              </IconButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
