import React, { useState } from 'react';
import { Agenda, AgendaSchedule, LocaleConfig } from 'react-native-calendars';
import { withTheme } from 'react-native-paper';
import moment from 'moment';
import ActividadRow from '../Home/ActividadRow';

LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul.', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: "Hoy"
};
LocaleConfig.defaultLocale = 'es';

function Calendario({ actividades, readOnly, mostrarPaciente = false, onActividadClick }) {
  console.log('ACTIVIDADES',actividades)
    const [items, setItems] = useState({});

    const timeToString = (time) => {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    const loadItems = (day) => {
        setTimeout(() => {
          for (let i = 0; i < 30; i++) {
            const time = day.timestamp + i * 24 * 60 * 60 * 1000;
            const strTime = timeToString(time);
    
            if (!items[strTime]) {
              items[strTime] = [];
              
              const numItems = actividades.filter((actividad) => actividad.fecha.split('T')[0] === strTime);
              
              for (let j = 0; j < numItems.length; j++) {
                items[strTime].push(numItems[j]);
              }
            }
          }
          
          const newItems = {};
          Object.keys(items).forEach(key => {
            newItems[key] = items[key];
          });
          setItems(newItems);
        }, 1000);
    }

    const renderItem = (item) => {
        return (
            <ActividadRow
            onActividadClick={onActividadClick}
            actividad={item}
            mostrarPaciente={mostrarPaciente}
            readOnly={readOnly}
            />
        );
    }

    return (
            <Agenda
                items={items}
                loadItemsForMonth={loadItems}
                selected={moment().format("YYYY-MM-DD")}
                renderItem={renderItem}
                firstDay={1}
                theme={{
                    dotColor: '#06838c',
                    selectedDayBackgroundColor: '#06838c',
                    todayTextColor: '#CC3F7C',
                    textDayFontWeight: '500',
                    agendaTodayColor: '#CC3F7C',
                    agendaDayTextColor: '#6f6f6f',
                    agendaDayNumColor: '#6f6f6f',
                }}
            />
       
    )

}

export default withTheme(Calendario);