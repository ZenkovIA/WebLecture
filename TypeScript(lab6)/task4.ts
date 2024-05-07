type User3 = {
    id: string;
    name: string;
}

type Role = "student" | "teacher"

type Rate =  1 | 2 | 3 | 4 | 5

type Level =  "junior" | "middle" | "senior"

type Course2 = {
    id: number;
    title: string;
    role: Role;
    rate: Rate;
    level: Level;
}

/* --- */

type Student2 = User3 & { courses: { [id: number]: Omit<Course2, "role"> & { role: Exclude<Role, "teacher">} } }

type Teacher2 = User3 & {
    level: Level;
    courses: { [id: number]: Pick<Course2, 'id' | 'title' | 'role'> }
};

type Director2 = User3 & {
    students: Partial<{ [id: string]: Student2 }>;
    teachers: Partial<{ [id: string]: Teacher2 & Partial<Pick<Course2, 'rate'>>  }>;
};

/*--  Проверка  --*/
const s2: Student2 = {
    id: "s1",
    name: "s1",
    courses: {
        [1]: {
            id: 1,
            title: "First",
            rate: 5,
            role: "student",
            level: "middle"
        }
    },
}

const t2: Teacher2 = {
    id: "t1",
    name: "t1",
    level: "junior",
    courses: {
        [5]: {
            id: 5,
            title: "Fifth",
            role: "teacher"
        },
        [1]: {
            ...s2.courses[1],
            role: "teacher"
        }
    }
}

const d2: Director2 = {
    id: "d1",
    name: "d1",
    students: {
        ["s1"]: s2,
        ["s2"]: {
            id: "s2",
            name: "s2",
            courses: {} // Опять
        }
    },
    teachers: {
        ["t1"]: {
            ...t2,
            rate: 3
        },
        ["t2"]: {
            id: "t2",
            name: "t2",
            level: "senior",
            rate: 5,
            courses: {}
        }
    }
}