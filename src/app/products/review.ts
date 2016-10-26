export class Review {
  constructor(
    public id:         number,
    public product:    number,
    public rate:       number,
    public text:       string,
    public images:     string[],
    public created_at: Date,
    public created_by: {}
    ) { }
}
