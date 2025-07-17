export const store = {
  subjects: JSON.parse(localStorage.getItem('subjects')) || [],

  addSubject(subject) {
    this.subjects.push(subject)
    localStorage.setItem('subjects', JSON.stringify(this.subjects))
  },

  deleteSubject(id) {
    this.subjects = this.subjects.filter(s => s.id !== id)
    localStorage.setItem('subjects', JSON.stringify(this.subjects))
  },

  revisions: JSON.parse(localStorage.getItem('revisions')) || [],

  addRevision(revision) {
    this.revisions.push(revision)
    localStorage.setItem('revisions', JSON.stringify(this.revisions))
  },

  deleteRevision(id) {
    this.revisions = this.revisions.filter(r => r.id !== id)
    localStorage.setItem('revisions', JSON.stringify(this.revisions))
  }
}
