// This file will define the structure of your Supabase table and any methods for interacting with it.

class orders {
    constructor(id, user_id, status, total_price, created_at) {
        this.id = id
        this.userId = userId
        this.status = status
        this.total_price = total_price
        this.created_at = created_at

    }
}
module.exports = orders;

