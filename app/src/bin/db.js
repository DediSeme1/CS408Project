const Database = require('better-sqlite3');


const createMembersTableSQL = `
  CREATE TABLE IF NOT EXISTS members (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name   TEXT    NOT NULL,
    last_name    TEXT    NOT NULL,
    email        TEXT    NOT NULL,
    phone_number TEXT    NOT NULL,
    status       TEXT    NOT NULL DEFAULT 'Active',
    join_date    TEXT    NOT NULL,
    created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
  )`;

const createCoachesTableSQL = `
  CREATE TABLE IF NOT EXISTS coaches (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name   TEXT    NOT NULL,
    last_name    TEXT    NOT NULL,
    email        TEXT    NOT NULL,
    phone_number TEXT    NOT NULL,
    specialty   TEXT    NOT NULL,
    join_date    TEXT    NOT NULL,
    created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
  )`;

const createClassesTableSQL = `
  CREATE TABLE IF NOT EXISTS classes (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    class_name TEXT    NOT NULL,
    coach      TEXT    NOT NULL,
    class_date TEXT    NOT NULL,
    class_time TEXT    NOT NULL,
    capacity   INTEGER NOT NULL,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  )`;



const SEED_MEMBERS = [
  { first_name: 'John',    last_name: 'Smith',    email: 'john.smith@example.com',    phone_number: '(208) 555-0101', status: 'Active',   join_date: '2024-01-15' },
  { first_name: 'Sarah',   last_name: 'Johnson',  email: 'sarah.j@example.com',       phone_number: '(208) 555-0102', status: 'Active',   join_date: '2024-02-20' },
  { first_name: 'Michael', last_name: 'Brown',    email: 'mbrown@example.com',        phone_number: '(208) 555-0103', status: 'Inactive', join_date: '2023-11-30' },
  { first_name: 'Emily',   last_name: 'Davis',    email: 'emily.davis@example.com',   phone_number: '(208) 555-0104', status: 'Active',   join_date: '2024-03-05' },
  { first_name: 'David',   last_name: 'Wilson',   email: 'dwilson@example.com',       phone_number: '(208) 555-0105', status: 'Active',   join_date: '2023-07-09' },
  { first_name: 'Lisa',    last_name: 'Anderson', email: 'lisa.a@example.com',        phone_number: '(208) 555-0106', status: 'Inactive', join_date: '2023-09-15' },
];

const SEED_COACHES = [
  { first_name: 'Mike',    last_name: 'Thompson', email: 'mike.thompson@courtops.com', phone_number: '(208) 555-0201', specialty: 'Strength Training', join_date: '2022-06-01' },
  { first_name: 'Jessica', last_name: 'Lee',      email: 'jessica.lee@courtops.com',  phone_number: '(208) 555-0202', specialty: 'Basketball',        join_date: '2021-09-15' },
  { first_name: 'Robert',  last_name: 'Garcia',   email: 'robert.g@courtops.com',     phone_number: '(208) 555-0203', specialty: 'CrossFit',          join_date: '2023-01-10' },
  { first_name: 'Amanda',  last_name: 'Chen',     email: 'amanda.chen@courtops.com',  phone_number: '(208) 555-0204', specialty: 'Weightlifting',     join_date: '2022-11-20' },
  { first_name: 'Chris',   last_name: 'Martinez', email: 'chris.m@courtops.com',      phone_number: '(208) 555-0205', specialty: 'Boxing',            join_date: '2023-04-05' },
];

const SEED_CLASSES = [
  { class_name: 'Morning Yoga',          coach: 'Jessica Lee',    class_date: '2026-04-01', class_time: '09:00 AM', capacity: 12 },
  { class_name: 'Strength & Conditioning', coach: 'Mike Thompson', class_date: '2026-04-01', class_time: '03:00 PM', capacity: 8  },
  { class_name: 'CrossFit Fundamentals', coach: 'Robert Garcia',  class_date: '2026-04-02', class_time: '05:00 PM', capacity: 15 },
  { class_name: 'Evening Pilates',       coach: 'Amanda Chen',    class_date: '2026-04-03', class_time: '06:00 PM', capacity: 10 },
  { class_name: 'Boxing Bootcamp',       coach: 'Chris Martinez', class_date: '2026-04-04', class_time: '07:00 PM', capacity: 14 },
];



function createDatabaseManager(dbPath) {
  const database = new Database(dbPath);
  console.log('Database manager created for:', dbPath);

  database.pragma('journal_mode = WAL');
  database.pragma('foreign_keys = ON');

  // Create all tables on startup
  database.exec(createMembersTableSQL);
  database.exec(createCoachesTableSQL);
  database.exec(createClassesTableSQL);

  function ensureConnected() {
    if (!database.open) {
      throw new Error('Database connection is not open');
    }
  }

  

  const membersHelpers = {
    getAllMembers: () =>
      database.prepare('SELECT * FROM members ORDER BY last_name, first_name').all(),

    getMemberById: (id) =>
      database.prepare('SELECT * FROM members WHERE id = ?').get(id),

    createMember: ({ first_name, last_name, email, phone_number, status, join_date }) => {
      const info = database
        .prepare(`INSERT INTO members (first_name, last_name, email, phone_number, status, join_date)
                  VALUES (?, ?, ?, ?, ?, ?)`)
        .run(first_name, last_name, email, phone_number, status ?? 'Active', join_date ?? new Date().toISOString().slice(0, 10));
      return info.lastInsertRowid;
    },

    updateMemberStatus: (id, status) => {
      const info = database
        .prepare('UPDATE members SET status = ? WHERE id = ?')
        .run(status, id);
      return info.changes;
    },

    deleteMember: (id) => {
      const info = database.prepare('DELETE FROM members WHERE id = ?').run(id);
      return info.changes;
    },

    countActiveMembers: () =>
      database.prepare("SELECT COUNT(*) AS c FROM members WHERE status = 'Active'").get().c,

    countAllMembers: () =>
      database.prepare('SELECT COUNT(*) AS c FROM members').get().c,
  };

  

  const coachesHelpers = {
    getAllCoaches: () =>
      database.prepare('SELECT * FROM coaches ORDER BY last_name, first_name').all(),

    getCoachById: (id) =>
      database.prepare('SELECT * FROM coaches WHERE id = ?').get(id),

    createCoach: ({ first_name, last_name, email, phone_number, specialty, join_date }) => {
      const info = database
        .prepare(`INSERT INTO coaches (first_name, last_name, email, phone_number, specialty, join_date)
                  VALUES (?, ?, ?, ?, ?, ?)`)
        .run(first_name, last_name, email, phone_number, specialty, join_date ?? new Date().toISOString().slice(0, 10));
      return info.lastInsertRowid;
    },

    updateCoach: (id, { first_name, last_name, email, phone_number, specialty }) => {
      const info = database
        .prepare(`UPDATE coaches
                  SET first_name = ?, last_name = ?, email = ?, phone_number = ?, specialty = ?
                  WHERE id = ?`)
        .run(first_name, last_name, email, phone_number, specialty, id);
      return info.changes;
    },

    deleteCoach: (id) => {
      const info = database.prepare('DELETE FROM coaches WHERE id = ?').run(id);
      return info.changes;
    },

    countAllCoaches: () =>
      database.prepare('SELECT COUNT(*) AS c FROM coaches').get().c,
  };

  const classesHelpers = {
    getAllClasses: () =>
      database.prepare('SELECT * FROM classes ORDER BY class_date, class_time').all(),

    getClassById: (id) =>
      database.prepare('SELECT * FROM classes WHERE id = ?').get(id),

    createClass: ({ class_name, coach, class_date, class_time, capacity }) => {
      const info = database
        .prepare(`INSERT INTO classes (class_name, coach, class_date, class_time, capacity)
                  VALUES (?, ?, ?, ?, ?)`)
        .run(class_name, coach, class_date, class_time, capacity);
      return info.lastInsertRowid;
    },

    updateClass: (id, { class_name, coach, class_date, class_time, capacity }) => {
      const info = database
        .prepare(`UPDATE classes
                  SET class_name = ?, coach = ?, class_date = ?, class_time = ?, capacity = ?
                  WHERE id = ?`)
        .run(class_name, coach, class_date, class_time, capacity, id);
      return info.changes;
    },

    deleteClass: (id) => {
      const info = database.prepare('DELETE FROM classes WHERE id = ?').run(id);
      return info.changes;
    },

    countWeeklyClasses: () => {
   
      return database
        .prepare(`SELECT COUNT(*) AS c FROM classes
                  WHERE class_date BETWEEN date('now') AND date('now', '+7 days')`)
        .get().c;
    },

    countAllClasses: () =>
      database.prepare('SELECT COUNT(*) AS c FROM classes').get().c,
  };

  

  const dbHelpers = {
    seedSampleData: () => {
      ensureConnected();

      const insertMember = database.prepare(
        `INSERT INTO members (first_name, last_name, email, phone_number, status, join_date)
         VALUES (@first_name, @last_name, @email, @phone_number, @status, @join_date)`
      );
      const insertCoach = database.prepare(
        `INSERT INTO coaches (first_name, last_name, email, phone_number, specialty, join_date)
         VALUES (@first_name, @last_name, @email, @phone_number, @specialty, @join_date)`
      );
      const insertClass = database.prepare(
        `INSERT INTO classes (class_name, coach, class_date, class_time, capacity)
         VALUES (@class_name, @coach, @class_date, @class_time, @capacity)`
      );

      database.transaction(() => {
        for (const m of SEED_MEMBERS) insertMember.run(m);
        for (const c of SEED_COACHES) insertCoach.run(c);
        for (const cl of SEED_CLASSES) insertClass.run(cl);
      })();

      console.log('Sample data seeded: members, coaches, classes');
    },

    clearDatabase: () => {
      if (process.env.NODE_ENV === 'test') {
        ensureConnected();
        database.prepare('DELETE FROM classes').run();
        database.prepare('DELETE FROM coaches').run();
        database.prepare('DELETE FROM members').run();
        console.log('Database cleared (test env)');
      } else {
        console.warn('clearDatabase called outside of test environment. FIXME!');
      }
    },

    close: () => database.close(),
  };

  return {
    members: membersHelpers,
    coaches: coachesHelpers,
    classes: classesHelpers,
    dbHelpers,
  };
}

module.exports = { createDatabaseManager };