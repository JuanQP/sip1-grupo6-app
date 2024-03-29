import { belongsTo, createServer, Factory, hasMany, Model, Response, RestSerializer } from "miragejs"
import moment from 'moment';
import { dateSort, pickRandom, random } from "../utils/utils";

// Fake server para usar la app

if (window.server) {
  server.shutdown()
}

const hoy = moment();
const horarios = [0, 15, 30, 45];
const tiposActividades = [
  'Medicación',
  'Consulta Médica',
  'Estudio Médico',
  'Otro',
]
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

function middleware(request) {
  try {
    const token = request.requestHeaders.Authorization.split(' ')[1];
    if (Number.isNaN(token)) {
      throw new Error('No autorizado');
    }
    return token;
  } catch (error) {
    return null;
  }
}

export const crearServer = () => createServer({
  serializers: {
    paciente: RestSerializer.extend({
      include: ['sexo', 'provincia', 'tipoDocumento', 'familiars'],
      embed: true,
    }),
    familiar: RestSerializer.extend({
      include: ['provincia'],
      embed: true,
    }),
    actividad: RestSerializer.extend({
      include: ['dias'],
      embed: true,
    })
  },
  models: {
    usuario: Model.extend({
      pacientes: hasMany(),
    }),
    paciente: Model.extend({
      usuario: belongsTo('usuario', {inverse: 'pacientes'}),
      actividads: hasMany(),
      provincia: belongsTo('provincia', {inverse: 'pacientes'}),
      tipoDocumento: belongsTo('tipoDocumento', {inverse: 'pacientes'}),
      sexo: belongsTo('sexo', {inverse: 'pacientes'}),
      familiars: hasMany('familiar', {inverse: 'paciente'}),
    }),
    actividad: Model.extend({
      paciente: belongsTo('paciente', {inverse: 'actividads'}),
      dias: hasMany('dia', {inverse: 'dias'}),
    }),
    familiar: Model.extend({
      paciente: belongsTo('paciente', {inverse: 'familiars'}),
      provincia: belongsTo('provincia', {inverse: 'familiars'}),
    }),
    provincia: Model,
    tipoActividad: Model,
    dia: Model.extend({
      actividads: hasMany('actividad', {inverse: 'actividads'}),
    }),
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
      return {
        token: usuario.id,
        email,
        esFamiliar: usuario.esFamiliar,
      };
    });

    this.patch('/usuario', (schema, request) => {
      const { email, expoPushToken } = JSON.parse(request.requestBody);
      return schema.usuarios.findBy({ email }).update({ expoPushToken });
    });

    this.post('https://exp.host/--/api/v2/push/updateDeviceToken', (schema, request) => {
      return {data: {expoPushToken: "ExponentPushToken[PSGkI4IJHWt8M8AjGwvGMp]"}};
    });

    this.post('https://exp.host/--/api/v2/push/getExpoPushToken', (schema, request) => {
      return {data: {expoPushToken: "ExponentPushToken[PSGkI4IJHWt8M8AjGwvGMp]"}};
    });

    // Pacientes
    this.get('/pacientes/:id', 'pacientes');
    this.get('/pacientes', (schema, request) => {
      const usuarioId = middleware(request);
      return schema.pacientes.where({ usuarioId });
    });
    this.patch('/pacientes/:id', (schema, request) => {
      const {provincia, sexo, tipoDocumento, ...paciente} = JSON.parse(request.requestBody);

      return schema.pacientes.find(request.params.id).update(paciente);
    });
    this.post('/pacientes', (schema, request) => {
      const paciente = JSON.parse(request.requestBody);
      const usuarioId = middleware(request);
      paciente.usuarioId = usuarioId;
      return schema.pacientes.create(paciente);
    });

    // Actividades
    this.get('/actividads/:id');
    this.get('/actividads', function(schema, request) {
      const { queryParams } = request;
      const actividades = this.serialize(schema.actividads.where(queryParams)).actividads;
      return { actividades: actividades.sort(dateSort) };
    });
    this.get('/actividads-same-hour', (schema, request) => {
      const datetime = moment(request.queryParams.datetime);
      const usuarioId = String(middleware(request));
      const pacientes = schema.pacientes.where({ usuarioId }).models;
      const actividades = schema.actividads.where(
        a => pacientes.some(p => p.id == a.pacienteId) && datetime.isSame(a.fecha, 'minute')
      );
      return actividades;
    });
    this.patch('/actividads/:id', (schema, request) => {
      const actividad = JSON.parse(request.requestBody);
      return schema.actividads.find(request.params.id).update(actividad);
    });
    this.post('/actividads/', (schema, request) => {
      const actividad = JSON.parse(request.requestBody);
      if(!('estado' in actividad)) {
        actividad['estado'] = 'pendiente';
      }
      return schema.actividads.create(actividad);
    });

    // Familiares
    this.get('/familiars/:id');
    this.get('/familiars', (schema, request) => {
      const { queryParams } = request;

      return schema.familiars.where(queryParams);
    });
    this.patch('/familiars/:id', (schema, request) => {
      const familiar = JSON.parse(request.requestBody);

      return schema.familiars.find(request.params.id).update(familiar);
    });
    this.post('/familiars/', (schema, request) => {
      const familiar = JSON.parse(request.requestBody);

      return schema.familiars.create(familiar);
    });

    this.get('/notificaciones', function(schema, request) {
      return {
        notificaciones: [
          {
            fecha: new Date(2022, 4, 25, 17, 31, 0),
            nombre: "Diurex",
            razon: "Se alargó la sesión de kinesiología, debo esperar que termine.",
          },
          {
            fecha: new Date(2022, 4, 25, 11, 3, 0),
            nombre: "Vitaminas",
            razon: "Se acabaron. Al mediodía salgo a comprar y se las doy al regreso.",
          },
        ],
      };
    });

    this.get('/familiar-home', function(schema, request) {
      const usuarioId = String(middleware(request));
      const usuario = schema.usuarios.find(usuarioId);
      if(usuario.esFamiliar) {
        const { paciente } = this.serialize(schema.pacientes.find("1"));
        const { actividads: actividades } = this.serialize(schema.actividads.where({ pacienteId: "1" }));
        const data = {
          familiar: {
            id: usuarioId,
            nombre: 'Jorge',
            paciente: {
              ...paciente,
              actividades: actividades.sort(dateSort),
            },
          }
        };
        return data;
      }
    });

    this.get('/mi-semana', function(schema, request) {
      const usuarioId = String(middleware(request));
      const today = moment();
      const pacientes = this.serialize(schema.pacientes.where({ usuarioId }))
        .pacientes
        .map(p => ({id: p.id, imagen: p.imagen, nombre: p.nombre}));
      const actividades = schema.actividads.where(
        a => pacientes.some(p => p.id == a.pacienteId) && today.isSame(a.fecha, 'week')
      );

      return actividades.models.sort(dateSort).map(
        a => ({
          ...a.attrs,
          paciente: pacientes.find(p => p.id == a.pacienteId),
        })
      );
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

      nombre() {
        return this.tipo === 'Medicación' ? pickRandom(medicaciones) : 'Lorem ipsum';
      },

      observaciones() {
        return "Lorem ipsum";
      },

      estado() {
        return pickRandom(estados);
      },

      dosis() {
        return `${String(random(10, 50))} mg`;
      },

      duracion() {
        return random(1, 30);
      },

      frecuencia() {
        return pickRandom([6, 12, 24]);
      },

      diaIds() {
        return [1, 3, 5];
      },

      tipo() {
        return pickRandom(tiposActividades);
      },

      repeticiones() {
        return this.tipo === 'Otro' ? pickRandom([true, false]) : false;
      },

      direccion() {
        return 'Lorem ipsum';
      },

      nota() {
        return '';
      }
    })
  },

  seeds(server) {
    // Usuarios
    const usuarioCuidador = server.create('usuario', {email: 'cuidador@email.com', password: 'test', esFamiliar: false});
    const usuarioFamiliar = server.create('usuario', {email: 'familiar@email.com', password: 'test', esFamiliar: true});

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
      fechaNacimiento: '1940-10-04',
      sexoId: 2,
      tipoDocumentoId: 1,
      numeroDocumento: '12678345',
      telefono: '1143215678',
      provinciaId: 2,
      localidad: 'Tigre',
      obraSocial: 'Swiss Medical',
      numeroAfiliado: '12567810901',
      observaciones: 'Paciente con artrosis, antecedentes de patologías cardiovasculares y Alzheimer en etapa temprana.',
      imagen: 'mirta.png',
      domicilio: 'Lima 775',
    });

    const andras = server.schema.pacientes.create({
      nombre: 'András Arató',
      fechaNacimiento: '1945-11-07',
      sexoId: 1,
      tipoDocumentoId: 1,
      numeroDocumento: '92574666',
      telefono: '0602527232',
      provinciaId: 1,
      localidad: 'Retiro',
      obraSocial: 'OSDE',
      numeroAfiliado: '47234659631',
      observaciones: 'Tiene mala suerte',
      imagen: 'andras.png',
      domicilio: 'Falsa 123',
    });

    mirta.newFamiliar({
      nombre: 'Jorge Díaz Pérez',
      relacion: 'Hijo',
      localidad: 'Barracas',
      provinciaId: 1,
      telefono: '1122334455',
      esContactoDeEmergencia: true,
    });
    mirta.newFamiliar({
      nombre: 'Florencia Díez Pérez',
      relacion: 'Hija',
      localidad: 'Villa Lugano',
      provinciaId: 1,
      telefono: '1150750012',
      esContactoDeEmergencia: false,
    });

    mirta.actividads = server.createList('actividad', random(5, 15)).sort((a,b) => {
      return moment(a.fecha).diff(moment(b.fecha));
    });
    mirta.save();
    andras.actividads = server.createList('actividad', random(5, 15)).sort((a,b) => {
      return moment(a.fecha).diff(moment(b.fecha));
    });
    andras.save();

    usuarioCuidador.pacientes = [mirta, andras];
    usuarioCuidador.save();
  },
});

console.log('MirageJS Server is up!');
