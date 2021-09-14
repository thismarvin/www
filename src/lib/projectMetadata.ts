export default class ProjectMetadata {
	name: string;
	href: string;
	date: Date;

	constructor(name: string, href: string, date: Date) {
		this.name = name;
		this.href = href;
		this.date = date;
	}
}
