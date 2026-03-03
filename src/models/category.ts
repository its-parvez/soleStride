import mongoose, { Schema, Document, models, Types } from "mongoose";

export interface ICategory extends Document {
  id : string ;
  name: string;
  description?: string;
  parentId: Types.ObjectId | null ;
  level: number;
  highlight? : boolean;
  
}

const CategorySchema = new Schema<ICategory>(
  { id : {type : String , required : true },
    name: { type: String, required: true },
    description : {type : String},
    parentId: {
      type : Schema.Types.ObjectId , 
      ref : "Category", 
      default : null 
     },
    level : {type : Number , required : true },
    highlight : {type : Boolean},
   
    
  },
  { timestamps: true }
);

const Category = models.Category || mongoose.model<ICategory>("Category", CategorySchema);


export {Category}