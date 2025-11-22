const cds = require('@sap/cds');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function loadData() {
    try {
        // Connect to the database
        const db = await cds.connect.to('db');
        const { Users, Assets, MaintenanceRequests } = db.entities('mm');

        console.log('Loading data into database...');

        const now = new Date().toISOString();
        const salt = await bcrypt.genSalt(10);

        // Hash passwords
        const adminHash = await bcrypt.hash('admin123', salt);
        const managerHash = await bcrypt.hash('manager123', salt);
        const techHash = await bcrypt.hash('tech123', salt);
        const requesterHash = await bcrypt.hash('requester123', salt);

        // Insert Admin
        const adminUsers = [{
            ID: uuidv4(),
            name: 'Administrador Principal',
            email: 'admin@example.com',
            password: adminHash,
            role: 'ADMIN',
            isActive: true,
            createdAt: now,
            modifiedAt: now,
            createdBy: 'seed',
            modifiedBy: 'seed'
        }];

        // Insert 3 Managers
        const managerUsers = [
            { ID: uuidv4(), name: 'María García López', email: 'maria.garcia@example.com', password: managerHash, role: 'MANAGER', isActive: true, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' },
            { ID: uuidv4(), name: 'Carlos Rodríguez Martínez', email: 'carlos.rodriguez@example.com', password: managerHash, role: 'MANAGER', isActive: true, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' },
            { ID: uuidv4(), name: 'Ana Fernández Sánchez', email: 'ana.fernandez@example.com', password: managerHash, role: 'MANAGER', isActive: true, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' }
        ];

        // Insert 10 Technical Users
        const techUsers = [
            { ID: uuidv4(), name: 'Juan Pérez Gómez', email: 'juan.perez@example.com', password: techHash, role: 'TECH', isActive: true, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' },
            { ID: uuidv4(), name: 'Luis Hernández Torres', email: 'luis.hernandez@example.com', password: techHash, role: 'TECH', isActive: true, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' },
            { ID: uuidv4(), name: 'Pedro Martínez Ruiz', email: 'pedro.martinez@example.com', password: techHash, role: 'TECH', isActive: true, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' },
            { ID: uuidv4(), name: 'Miguel Ángel Díaz', email: 'miguel.diaz@example.com', password: techHash, role: 'TECH', isActive: true, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' },
            { ID: uuidv4(), name: 'Roberto González Vega', email: 'roberto.gonzalez@example.com', password: techHash, role: 'TECH', isActive: true, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' },
            { ID: uuidv4(), name: 'Francisco Jiménez Castro', email: 'francisco.jimenez@example.com', password: techHash, role: 'TECH', isActive: true, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' },
            { ID: uuidv4(), name: 'David López Morales', email: 'david.lopez@example.com', password: techHash, role: 'TECH', isActive: true, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' },
            { ID: uuidv4(), name: 'José Antonio Ramírez', email: 'jose.ramirez@example.com', password: techHash, role: 'TECH', isActive: true, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' },
            { ID: uuidv4(), name: 'Alejandro Cruz Mendoza', email: 'alejandro.cruz@example.com', password: techHash, role: 'TECH', isActive: true, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' },
            { ID: uuidv4(), name: 'Daniel Ortiz Silva', email: 'daniel.ortiz@example.com', password: techHash, role: 'TECH', isActive: true, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' }
        ];

        // Insert Requester
        const requesterUsers = [{
            ID: uuidv4(),
            name: 'Usuario Solicitante',
            email: 'requester@example.com',
            password: requesterHash,
            role: 'REQUESTER',
            isActive: true,
            createdAt: now,
            modifiedAt: now,
            createdBy: 'seed',
            modifiedBy: 'seed'
        }];

        const allUsers = [...adminUsers, ...managerUsers, ...techUsers, ...requesterUsers];
        await INSERT.into(Users).entries(allUsers);
        console.log(`✓ ${allUsers.length} usuarios cargados`);

        // Insert 60 Assets
        const assets = [
            // Aires Acondicionados (10)
            { code: 'AC-001', name: 'Aire Acondicionado Sala Principal', location: 'Piso 1, Sala de Reuniones', info: 'Unidad HVAC 24000 BTU', status: 1 },
            { code: 'AC-002', name: 'Aire Acondicionado Oficina Gerencia', location: 'Piso 2, Gerencia', info: 'Unidad Split 18000 BTU', status: 1 },
            { code: 'AC-003', name: 'Aire Acondicionado Sala de Servidores', location: 'Piso -1, Data Center', info: 'Unidad de Precisión 36000 BTU', status: 1 },
            { code: 'AC-004', name: 'Aire Acondicionado Recepción', location: 'Piso 1, Recepción', info: 'Unidad Central 12000 BTU', status: 1 },
            { code: 'AC-005', name: 'Aire Acondicionado Cafetería', location: 'Piso 1, Cafetería', info: 'Unidad Comercial 24000 BTU', status: 1 },
            { code: 'AC-006', name: 'Aire Acondicionado Sala de Capacitación', location: 'Piso 3, Aula A', info: 'Unidad Split 18000 BTU', status: 1 },
            { code: 'AC-007', name: 'Aire Acondicionado Archivo', location: 'Piso -1, Archivo General', info: 'Unidad Central 15000 BTU', status: 2 },
            { code: 'AC-008', name: 'Aire Acondicionado Sala de Juntas', location: 'Piso 4, Sala Ejecutiva', info: 'Unidad VRV 30000 BTU', status: 1 },
            { code: 'AC-009', name: 'Aire Acondicionado Oficina Contabilidad', location: 'Piso 2, Contabilidad', info: 'Unidad Split 12000 BTU', status: 1 },
            { code: 'AC-010', name: 'Aire Acondicionado Gimnasio', location: 'Piso 5, Gimnasio', info: 'Unidad Industrial 48000 BTU', status: 1 },

            // Computadoras y Equipos TI (15)
            { code: 'PC-001', name: 'Computadora Escritorio Director', location: 'Piso 4, Dirección', info: 'HP EliteDesk 800 G8', status: 1 },
            { code: 'PC-002', name: 'Laptop Gerente Ventas', location: 'Piso 2, Ventas', info: 'Dell Latitude 5520', status: 1 },
            { code: 'PC-003', name: 'Workstation Diseño Gráfico', location: 'Piso 3, Diseño', info: 'Dell Precision 5820', status: 1 },
            { code: 'SRV-001', name: 'Servidor Principal', location: 'Piso -1, Data Center', info: 'Dell PowerEdge R740', status: 1 },
            { code: 'SRV-002', name: 'Servidor Backup', location: 'Piso -1, Data Center', info: 'HP ProLiant DL380', status: 1 },
            { code: 'SW-001', name: 'Switch Principal Red', location: 'Piso -1, Rack Principal', info: 'Cisco Catalyst 2960-X', status: 1 },
            { code: 'RTR-001', name: 'Router Fibra Óptica', location: 'Piso -1, Telecomunicaciones', info: 'Cisco ISR 4331', status: 1 },
            { code: 'UPS-001', name: 'UPS Sala de Servidores', location: 'Piso -1, Data Center', info: 'APC Smart-UPS 3000VA', status: 1 },
            { code: 'MON-001', name: 'Monitor 4K Diseño', location: 'Piso 3, Diseño', info: 'Dell UltraSharp 27"', status: 1 },
            { code: 'MON-002', name: 'Monitor Dual Contabilidad', location: 'Piso 2, Contabilidad', info: 'HP EliteDisplay 24"', status: 1 },
            { code: 'TAB-001', name: 'Tablet Inventarios', location: 'Piso 1, Almacén', info: 'Samsung Galaxy Tab S7', status: 1 },
            { code: 'TAB-002', name: 'Tablet Presentaciones', location: 'Piso 4, Sala Ejecutiva', info: 'iPad Pro 12.9"', status: 1 },
            { code: 'CAM-001', name: 'Cámara Videoconferencia', location: 'Piso 3, Sala de Capacitación', info: 'Logitech Rally', status: 1 },
            { code: 'TEL-001', name: 'Sistema Telefónico IP', location: 'Piso 1, Recepción', info: 'Cisco IP Phone 8845', status: 1 },
            { code: 'NAS-001', name: 'Almacenamiento NAS', location: 'Piso -1, Data Center', info: 'Synology DS920+', status: 1 },

            // Impresoras (8)
            { code: 'PRT-001', name: 'Impresora Multifuncional Recepción', location: 'Piso 1, Recepción', info: 'HP LaserJet MFP M528', status: 1 },
            { code: 'PRT-002', name: 'Impresora Color Marketing', location: 'Piso 3, Marketing', info: 'Canon imagePRESS C165', status: 1 },
            { code: 'PRT-003', name: 'Impresora Contabilidad', location: 'Piso 2, Contabilidad', info: 'Brother MFC-L8900CDW', status: 1 },
            { code: 'PRT-004', name: 'Plotter Arquitectura', location: 'Piso 3, Diseño', info: 'HP DesignJet T830', status: 1 },
            { code: 'PRT-005', name: 'Impresora Etiquetas Almacén', location: 'Piso 1, Almacén', info: 'Zebra ZT230', status: 1 },
            { code: 'PRT-006', name: 'Impresora Tickets Cafetería', location: 'Piso 1, Cafetería', info: 'Epson TM-T88VI', status: 2 },
            { code: 'PRT-007', name: 'Impresora Oficina Legal', location: 'Piso 4, Legal', info: 'HP LaserJet Pro M404', status: 1 },
            { code: 'PRT-008', name: 'Escáner Documentos', location: 'Piso 2, Administración', info: 'Fujitsu ScanSnap iX1600', status: 1 },

            // Ascensores y Accesos (5)
            { code: 'ELV-001', name: 'Ascensor Principal', location: 'Torre A', info: 'Capacidad 8 personas, Otis Gen2', status: 1 },
            { code: 'ELV-002', name: 'Ascensor Servicio', location: 'Torre A, Zona Carga', info: 'Capacidad 1200 kg, Schindler 3300', status: 1 },
            { code: 'ELV-003', name: 'Montacargas', location: 'Torre B, Almacén', info: 'Capacidad 2000 kg', status: 1 },
            { code: 'ACC-001', name: 'Puerta Automática Principal', location: 'Entrada Principal', info: 'Automática sensor doble', status: 1 },
            { code: 'ACC-002', name: 'Torniquetes Acceso', location: 'Lobby Principal', info: 'Control biométrico', status: 1 },

            // Seguridad (7)
            { code: 'CAM-SEC-001', name: 'Cámara Seguridad Entrada', location: 'Entrada Principal', info: 'Hikvision 4MP PTZ', status: 1 },
            { code: 'CAM-SEC-002', name: 'Cámara Seguridad Estacionamiento', location: 'Estacionamiento Nivel 1', info: 'Dahua 2MP Bullet', status: 1 },
            { code: 'CAM-SEC-003', name: 'Cámara Seguridad Pasillo Piso 2', location: 'Piso 2, Pasillo Principal', info: 'Axis P3245-LV', status: 1 },
            { code: 'DVR-001', name: 'Grabador Video Digital', location: 'Piso -1, Seguridad', info: 'Hikvision 32CH NVR', status: 1 },
            { code: 'ALA-001', name: 'Sistema Alarma Incendios', location: 'Piso 1, Central', info: 'Honeywell FACP', status: 1 },
            { code: 'ALA-002', name: 'Sistema Alarma Intrusión', location: 'Perímetro Edificio', info: 'DSC PowerSeries', status: 1 },
            { code: 'EXT-001', name: 'Extintores CO2 Data Center', location: 'Piso -1, Data Center', info: 'Sistema automático CO2', status: 1 },

            // Sistemas Eléctricos (8)
            { code: 'PLN-001', name: 'Planta Eléctrica Principal', location: 'Exterior, Zona Técnica', info: 'Caterpillar 250 KVA', status: 1 },
            { code: 'TRA-001', name: 'Transformador Principal', location: 'Subestación Eléctrica', info: '500 KVA 13.2/480V', status: 1 },
            { code: 'PNL-001', name: 'Panel Eléctrico Piso 1', location: 'Piso 1, Cuarto Eléctrico', info: 'Panel 400A 3F', status: 1 },
            { code: 'PNL-002', name: 'Panel Eléctrico Piso 2', location: 'Piso 2, Cuarto Eléctrico', info: 'Panel 400A 3F', status: 1 },
            { code: 'PNL-003', name: 'Panel Eléctrico Data Center', location: 'Piso -1, Data Center', info: 'Panel 600A 3F', status: 1 },
            { code: 'ILU-001', name: 'Sistema Iluminación LED Oficinas', location: 'Pisos 1-4', info: 'Control automático', status: 1 },
            { code: 'ILU-002', name: 'Iluminación Emergencia', location: 'Todo el edificio', info: 'Sistema central batería', status: 1 },
            { code: 'POL-001', name: 'Póliza Mantenimiento Eléctrico', location: 'General', info: 'Revisión semestral', status: 1 },

            // Otros Equipos (7)
            { code: 'BOM-001', name: 'Bomba Agua Potable', location: 'Piso -1, Cisterna', info: 'Bomba centrífuga 5HP', status: 1 },
            { code: 'BOM-002', name: 'Bomba Aguas Residuales', location: 'Piso -1, Drenaje', info: 'Bomba sumergible 3HP', status: 2 },
            { code: 'CAL-001', name: 'Caldera Agua Caliente', location: 'Piso -1, Cuarto Máquinas', info: 'Caldera gas 200K BTU', status: 1 },
            { code: 'VEN-001', name: 'Ventilador Extracción Cocina', location: 'Piso 1, Cafetería', info: 'Extractor industrial', status: 1 },
            { code: 'REF-001', name: 'Refrigerador Cafetería', location: 'Piso 1, Cafetería', info: 'Refrigerador comercial', status: 1 },
            { code: 'MIC-001', name: 'Microondas Sala de Descanso', location: 'Piso 2, Sala de Descanso', info: 'Microondas 1200W', status: 1 },
            { code: 'CAF-001', name: 'Cafetera Automática', location: 'Piso 4, Sala Ejecutivos', info: 'Jura GIGA X8', status: 1 }
        ];

        const assetEntries = assets.map(asset => ({
            ID: uuidv4(),
            code: asset.code,
            name: asset.name,
            location: asset.location,
            info: asset.info,
            status: asset.status,
            createdAt: now,
            modifiedAt: now,
            createdBy: 'seed',
            modifiedBy: 'seed'
        }));

        await INSERT.into(Assets).entries(assetEntries);
        console.log(`✓ ${assetEntries.length} activos cargados`);

        // Create maintenance requests
        const requests = [
            { title: 'Aire acondicionado no enfría correctamente', description: 'El aire acondicionado de la sala de reuniones no enfría adecuadamente. La temperatura no baja de 26°C.', priority: 2, status: 'OPEN', assetCode: 'AC-001', techIndex: null },
            { title: 'Impresora atascada con papel', description: 'La impresora de la cafetería tiene papel atascado y no imprime tickets.', priority: 1, status: 'ASSIGNED', assetCode: 'PRT-006', techIndex: 0 },
            { title: 'Computadora muy lenta', description: 'La computadora del director está extremadamente lenta. Tarda más de 5 minutos en iniciar.', priority: 1, status: 'IN_PROGRESS', assetCode: 'PC-001', techIndex: 1 },
            { title: 'Bomba de agua haciendo ruido extraño', description: 'La bomba de aguas residuales está haciendo un ruido metálico inusual.', priority: 2, status: 'ASSIGNED', assetCode: 'BOM-002', techIndex: 2 },
            { title: 'Actualización de firmware del switch', description: 'Requiere actualización de firmware del switch principal para corrección de vulnerabilidad.', priority: 2, status: 'OPEN', assetCode: 'SW-001', techIndex: null },
            { title: 'Ascensor hace ruido al detenerse', description: 'El ascensor principal hace un ruido fuerte al llegar a cada piso.', priority: 1, status: 'ASSIGNED', assetCode: 'ELV-001', techIndex: 3 },
            { title: 'Cámara de seguridad sin imagen', description: 'La cámara del estacionamiento no muestra imagen en el monitor.', priority: 2, status: 'OPEN', assetCode: 'CAM-SEC-002', techIndex: null },
            { title: 'Mantenimiento preventivo UPS', description: 'Mantenimiento preventivo semestral del UPS de la sala de servidores.', priority: 3, status: 'DONE', assetCode: 'UPS-001', techIndex: 4 },
            { title: 'Reemplazo de toner impresora', description: 'La impresora de contabilidad necesita reemplazo de toner negro.', priority: 3, status: 'CLOSED', assetCode: 'PRT-003', techIndex: 5 },
            { title: 'Instalación de software nuevo', description: 'Instalar AutoCAD 2024 en la workstation de diseño gráfico.', priority: 2, status: 'IN_PROGRESS', assetCode: 'PC-003', techIndex: 6 }
        ];

        const requestEntries = requests.map(req => ({
            ID: uuidv4(),
            title: req.title,
            description: req.description,
            priority: req.priority,
            status: req.status,
            asset_ID: assetEntries.find(a => a.code === req.assetCode).ID,
            requestedBy_ID: requesterUsers[0].ID,
            assignedTo_ID: req.techIndex !== null ? techUsers[req.techIndex].ID : null,
            createdAt: now,
            modifiedAt: now
        }));

        await INSERT.into(MaintenanceRequests).entries(requestEntries);
        console.log(`✓ ${requestEntries.length} solicitudes de mantenimiento cargadas`);

        console.log('\n✅ Datos cargados exitosamente!');
        console.log(`Total: ${allUsers.length} usuarios, ${assetEntries.length} activos, ${requestEntries.length} solicitudes`);

    } catch (error) {
        console.error('❌ Error cargando datos:', error);
        process.exit(1);
    }
}

loadData().then(() => process.exit(0));
