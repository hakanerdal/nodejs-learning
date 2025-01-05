import mongoose, { Schema, Document, Model } from 'mongoose';

// Item için arayüz tanımı
export interface IItem extends Document {
    name: string;
}

// Item için şema tanımı
const itemSchema: Schema<IItem> = new Schema({
    name: { type: String, required: true },
});

// Modeli oluştur ve dışa aktar
const Item: Model<IItem> = mongoose.model<IItem>('Item', itemSchema);
export default Item;
