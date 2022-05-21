import moment from "moment";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { IconButton, TextInput, withTheme } from "react-native-paper";
import DateTimePicker from '@react-native-community/datetimepicker';

function FechaPicker({ label, fecha, onChange, ...props }) {

  const { colors } = props.theme
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    setDate(fecha);
    setTime(fecha);
  }, [fecha]);

  function onDateChange (event, selectedDate) {
    setShowDatePicker(false);
    if(event.type === "dismissed") {
      setDate(fecha);
      return;
    }
    setDate(selectedDate);
    setShowTimePicker(true);
  };

  function onTimeChange (event, selectedTime) {
    setShowTimePicker(false);
    if(event.type === "dismissed") {
      setDate(fecha);
      setTime(fecha);
      return;
    }
    setTime(selectedTime);

    const fechaNueva = new Date(date);
    fechaNueva.setHours(selectedTime.getHours());
    fechaNueva.setMinutes(selectedTime.getMinutes());
    onChange(fechaNueva);
  };

  function beginDatePicker() {
    hideAllCalendars();
    setShowDatePicker(true);
  }

  function hideAllCalendars() {
    setShowDatePicker(false);
    setShowTimePicker(false);
  }

  return (
    <View style={{flexDirection: "row", alignItems: "center"}}>
      <IconButton
        color={colors.primary}
        icon="calendar"
        onPress={beginDatePicker}
      />
      <TextInput
        style={{backgroundColor: 'transparent'}}
        mode='flat'
        label={label}
        value={moment(date).set({hour: time.getHours(), minute: time.getMinutes()}).format("DD/MM/YYYY HH:mm")}
        placeholder="14/10/1991 22:00"
        disabled
      />
      {(showDatePicker && <DateTimePicker
        testID={`${label}DatePicker`}
        value={date}
        mode={"date"}
        onChange={onDateChange}
      />)}
      {(showTimePicker && <DateTimePicker
        testID={`${label}DatePicker`}
        value={time}
        mode={"time"}
        onChange={onTimeChange}
        is24Hour
      />)}
    </View>
  )
}

export default withTheme(FechaPicker);