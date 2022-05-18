import { belongsTo, createServer, Factory, hasMany, Model, Response } from "miragejs"
import moment from 'moment';
import { pickRandom, random } from "../utils/utils";

// Fake server para usar la app

if (window.server) {
  server.shutdown()
}

const hoy = moment();
const horarios = [0, 15, 30, 45];
const medicaciones = [
  'Diurex',
  'Enalapril',
  'Multivitamínico',
  'Aricept',
];
const estados = [
  'completada',
  'pendiente',
  'pospuesta',
];

export const crearServer = () => createServer({
  models: {
    usuario: Model.extend({
      pacientes: hasMany(),
    }),
    paciente: Model.extend({
      usuario: belongsTo('usuario', {inverse: 'pacientes'}),
      actividads: hasMany(),
    }),
    actividad: Model.extend({
      paciente: belongsTo('paciente', {inverse: 'actividads'}),
    }),
    familiar: Model,
    provincia: Model,
    tipoActividad: Model,
    dia: Model,
    tipoDocumento: Model,
    sexo: Model,
  },

  routes() {
    this.namespace = 'api';

    // Ruta de login
    this.post('/login', (schema, request) => {
      const { email, password } = JSON.parse(request.requestBody);
      const usuario = schema.usuarios.findBy({ email, password });

      if(usuario === null) {
        return new Response(401, {}, { errors: ["Usuario o contraseña incorrectas 😞"] });
      }
      usuario['token'] = 'asdqwe';

      return usuario;
  
    }, { timing: 100 });

    // Pacientes
    this.get('/pacientes/:id', 'pacientes');
    this.get('/pacientes', (schema, request) => {
      return schema.pacientes.where({ usuarioId: 1 });
    });

    // Actividades
    this.get('/actividads/:id');
    this.get('/actividads', (schema, request) => {
      const { queryParams } = request;
      return schema.actividads.where(queryParams);
    });
    this.patch('/actividads/:id', (schema, request) => {
      const { ...actividad } = JSON.parse(request.requestBody);
      return schema.actividads.find(request.params.id).update(actividad);
    });

    // Dias
    this.get('/dias', 'dia');

    // Provincias
    this.get('/provincias', 'provincia');

    // Sexos
    this.get('/sexos', 'sexo');

    // Tipos documentos
    this.get('/tipos-documento', 'tipoDocumento');
  },

  factories: {
    actividad: Factory.extend({
      fecha() {
        return hoy.clone().add(random(-15, 15), "days").set({hour: random(9, 18), minute: pickRandom(horarios)});
      },

      descripcion() {
        return pickRandom(medicaciones);
      },

      observaciones() {
        return "Lorem ipsum"
      },

      estado() {
        return pickRandom(estados);
      },
    })
  },

  seeds(server) {
    // Usuarios
    const usuarioTest = server.create('usuario', {email: 'test', password: 'test'})

    // Sexos
    server.create('sexo', {descripcion: 'Masculino'});
    server.create('sexo', {descripcion: 'Femenino'});
    server.create('sexo', {descripcion: 'Otro'});

    // // Días
    server.schema.dia.create({descripcion: 'Lunes'});
    server.schema.dia.create({descripcion: 'Martes'});
    server.schema.dia.create({descripcion: 'Miércoles'});
    server.schema.dia.create({descripcion: 'Jueves'});
    server.schema.dia.create({descripcion: 'Viernes'});
    server.schema.dia.create({descripcion: 'Sábado'});
    server.schema.dia.create({descripcion: 'Domingo'});

    // Documentos
    server.create('tipoDocumento', {descripcion: 'DNI'});
    server.create('tipoDocumento', {descripcion: 'Libreta Cívica'});
    server.create('tipoDocumento', {descripcion: 'Libreta de Enrolamiento'});
    server.create('tipoDocumento', {descripcion: 'Cédula de Identidad'});

    // Provincias
    server.schema.provincia.create({descripcion: 'CABA'});
    server.schema.provincia.create({descripcion: 'Buenos Aires'});
    server.schema.provincia.create({descripcion: 'Catamarca'});
    server.schema.provincia.create({descripcion: 'Chaco'});
    server.schema.provincia.create({descripcion: 'Chubut'});
    server.schema.provincia.create({descripcion: 'Córdoba'});
    server.schema.provincia.create({descripcion: 'Corrientes'});
    server.schema.provincia.create({descripcion: 'Entre Ríos'});
    server.schema.provincia.create({descripcion: 'Formosa'});
    server.schema.provincia.create({descripcion: 'Jujuy'});
    server.schema.provincia.create({descripcion: 'La Pampa'});
    server.schema.provincia.create({descripcion: 'La Rioja'});
    server.schema.provincia.create({descripcion: 'Mendoza'});
    server.schema.provincia.create({descripcion: 'Misiones'});
    server.schema.provincia.create({descripcion: 'Neuquén'});
    server.schema.provincia.create({descripcion: 'Río Negro'});
    server.schema.provincia.create({descripcion: 'Salta'});
    server.schema.provincia.create({descripcion: 'San Juan'});
    server.schema.provincia.create({descripcion: 'San Luis'});
    server.schema.provincia.create({descripcion: 'Santa Cruz'});
    server.schema.provincia.create({descripcion: 'Santa Fe'});
    server.schema.provincia.create({descripcion: 'Santiago del Estero'});
    server.schema.provincia.create({descripcion: 'Tierra del Fuego'});
    server.schema.provincia.create({descripcion: 'Tucumán'});

    // Tipos de Actividades (por ahora hardcodeadas en el frontend)
    // server.schema.tipoActividad.create({descripcion: 'Medicación'});
    // server.schema.tipoActividad.create({descripcion: 'Consulta Médica'});
    // server.schema.tipoActividad.create({descripcion: 'Estudio Médico'});
    // server.schema.tipoActividad.create({descripcion: 'Otro'});

    const mirta = server.schema.pacientes.create({
      nombre: 'Mirta Pérez',
      fechaNacimiento: '10/04/1940',
      sexo: 'Femenino',
      tipoDocumento: 'DNI',
      numeroDocumento: '12678345',
      telefono: '1143215678',
      provincia: 'Buenos Aires',
      localidad: 'Tigre',
      obraSocial: 'Swiss Medical',
      numeroObraSocial: '12567810901',
      observaciones: 'Paciente con artrosis, antecedentes de patologías cardiovasculares y Alzheimer en etapa temprana.',
      imagen: 'mirta.png',
    });

    const andras = server.schema.pacientes.create({
      nombre: 'András Arató',
      fechaNacimiento: '11/07/1945',
      sexo: 'Masculino',
      tipoDocumento: 'DNI',
      numeroDocumento: '92574666',
      telefono: '0602527232',
      provincia: 'CABA',
      localidad: 'Retiro',
      obraSocial: 'OSDE',
      numeroObraSocial: '47234659631',
      observaciones: 'Tiene mala suerte',
      imagen: 'andras.png',
    });

    mirta.actividads = server.createList('actividad', random(5, 15)).sort((a,b) => {
      return moment(a.fecha).diff(moment(b.fecha));
    });
    mirta.save();
    andras.actividads = server.createList('actividad', random(5, 15)).sort((a,b) => {
      return moment(a.fecha).diff(moment(b.fecha));
    });
    andras.save();

    usuarioTest.pacientes = [mirta, andras];
    usuarioTest.save();
  },
});

console.log('Listo!');