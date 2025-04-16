declare global {
    interface MongooseCache {
      conn: mongoose.Connection | null;
      promise: Promise<mongoose.Connection> | null;
    }
    
    // Use let instead of var for modern JavaScript
    let mongoose: MongooseCache | undefined;
  }