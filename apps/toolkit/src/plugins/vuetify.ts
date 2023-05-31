import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import { VDataTable } from 'vuetify/labs/VDataTable';
import 'vuetify/styles';
import '../assets/styles/main.scss';

export default createVuetify({
  components: {
    VDataTable,
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#2b9bed',
          accent: '#5b00a0',
          secondary: '#2b9bed',
          surface: '#121212',
          background: '#161616',
          'background-darken-1': '#121212',
        },
      },
    },
  },
});
