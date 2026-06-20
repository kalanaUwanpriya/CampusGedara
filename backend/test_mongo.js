import mongoose from 'mongoose';

const uris = [
  "mongodb+srv://Campusgedraadmin:Campusgedraadmin@cluster0.1zokci9.mongodb.net/",
  "mongodb+srv://Campusgedraadmin:Campusgedraadmin@cluster0.1zokci9.mongodb.net/test?retryWrites=true&w=majority",
  "mongodb+srv://Campusgedraadmin:Campusgedraadmin@cluster0.1zokci9.mongodb.net/Campusgedra?retryWrites=true&w=majority"
];

async function test() {
  for (const uri of uris) {
    try {
      console.log(`Testing: ${uri}`);
      await mongoose.connect(uri);
      console.log('SUCCESS: ', uri);
      process.exit(0);
    } catch (e) {
      console.log('FAIL: ', e.message);
    }
  }
  process.exit(1);
}

test();
