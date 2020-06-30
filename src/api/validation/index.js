const {object, string, number} = require('yup')
const {getFaculties, getGenders, getStudyPrograms} = require('../model')

async function fetchFaculties() {
	const faculties = await getFaculties()
	return faculties
}

async function fetchStudyPrograms() {
	const studyPrograms = await getStudyPrograms()
	return studyPrograms
}

async function fetchGenders() {
	const genders = await getGenders()
	return genders
}

function generateProfessorSchema(genders, faculties) {
	const schema = object().shape({
		nip: number().required(),
		username: string().required(),
		password: string().min(8).required(),
		fullname: string().required(),
		address: string().required(),
		faculty: number()
			.oneOf(faculties.map(({id}) => id))
			.required(),
		gender: number()
			.oneOf(genders.map(({id}) => id))
			.required(),
	})

	return schema
}

function generateStudentSchema(genders, studyPrograms) {
	const schema = object().shape({
		nim: number().required(),
		username: string().required(),
		password: string().min(8).required(),
		fullname: string().required(),
		address: string().required(),
		study: number()
			.oneOf(studyPrograms.map(({id}) => id))
			.required(),
		gender: number()
			.oneOf(genders.map(({id}) => id))
			.required(),
		semester: number().required(),
	})

	return schema
}

async function professorSchema() {
	const genders = await fetchGenders()
	const faculties = await fetchFaculties()
	const schema = generateProfessorSchema(genders, faculties)
	return schema
}

async function studentSchema() {
	const genders = await fetchGenders()
	const studyPrograms = await fetchStudyPrograms()
	const schema = generateStudentSchema(genders, studyPrograms)
	return schema
}

module.exports = {professorSchema, studentSchema}
