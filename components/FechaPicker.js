import React, { useEffect } from "react";
import moment from "moment";
import { useState } from "react";
import { View } from "react-native";
import { IconButton, TextInput, withTheme } from "react-native-paper";
import DateTimePicker from '@react-native-community/datetimepicker';

function FechaPicker({ label, datetime, mode, placeholder, formatString, onChange, ...props }) {

  const { colors } = props.theme
  const [show, setShow] = useState(false);
  const [actualMode, setMode] = useState('date');

  useEffect(() => {
    setShow(false);
  }, []);

  function onDateTimeChange (event, selectedDateTime) {
    if(event.type === "dismissed") {
      return;
    }
    setShow(false);
    const newDateTime = new Date(datetime);
    
    if(actualMode === 'date') {
      newDateTime.setFullYear(
        selectedDateTime.getFullYear(),
        selectedDateTime.getMonth(),
        selectedDateTime.getDate(),
      );
    }
    else if(actualMode === 'time') {
      newDateTime.setHours(
        selectedDateTime.getHours(),
        selectedDateTime.getMinutes(),
      );
    }
    onChange(newDateTime);
  }

  function beginDatePicker() {
    setMode('date');
    setShow(true);
  }

  function beginTimePicker() {
    setMode('time');
    setShow(true);
  }

  function textInputDate() {
    return moment(datetime).format(formatString);
  }

  return (
    <View style={{flexDirection: "row", alignItems: "center"}}>
      { mode.includes('date') && <IconButton
        color={colors.primary}
        icon="calendar"
        onPress={beginDatePicker}
      />}
      { mode.includes('time') && <IconButton
        color={colors.primary}
        icon="clock-outline"
        onPress={beginTimePicker}
      />}
      <TextInput
        style={{backgroundColor: 'transparent'}}
        mode='flat'
        label={label}
        value={textInputDate()}
        placeholder={placeholder}
        disabled
      />
      {(show && <DateTimePicker
        testID={`${label}DateTimePicker`}
        value={datetime}
        mode={actualMode}
        onChange={onDateTimeChange}
        is24Hour
      />)}
    </View>
  )
}

FechaPicker.defaultProps = {
  label: '',
  mode: 'date',
  placeholder: '',
  datetime: new Date(),
  formatString: 'YYYY-MM-DD',
  onChange: () => {},
};

export default withTheme(FechaPicker);