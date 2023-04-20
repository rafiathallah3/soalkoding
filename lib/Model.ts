import mongoose, { model, Schema } from 'mongoose';
import { IAkun, IDiskusi, IFavorit, ISoal, ISolusi } from '../types/tipe';

const UserSchema = new Schema<IAkun>({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 40,
    },
    password: {
        type: String
    },
    nama: {
        type: String,
        default: "",
        maxlength: 50,
    },
    bio: {
        type: String,
        default: "",
        maxlength: 70,
    },
    tinggal: {
        type: String,
        default: "",
        maxlength: 20,
    },
    website: {
        type: String,
        default: "",
        maxlength: 30,
    },
    githuburl: {
        type: String,
        default: "",
        maxlength: 50,
    },
    gambar: {
        type: String,
        required: true,
        default: "/GambarProfile.jpg"
    },
    soalselesai: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "solusi",
        }],
        default: []
    },
    favorit: [{
        type: Schema.Types.ObjectId,
        ref: "favorit"
    }],
    MasukDenganGithub: {
        type: Boolean,
        required: true,
        default: false,
    },
    admin: {
        type: Boolean,
        required: true,
        default: false,
    },
    moderator: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });

const SolusiSchema = new Schema<ISolusi>({
    soal: {
        type: Schema.Types.ObjectId,
        ref: "soal",
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "akun",
        required: true
    },
    pintar: {
        type: [String],
        default: []
    },
    diskusi: [{
        type: Schema.Types.ObjectId,
        ref: "diskusi"
    }],
    kode: {
        type: String,
        required: true
    },
    bahasa: {
        type: String,
        required: true
    }
}, { timestamps: true });

const DiskusiSchema = new Schema<IDiskusi>({
    soal: {
        type: Schema.Types.ObjectId,
        ref: "soal",
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "akun",
        required: true
    },
    text: {
        type: String,
        required: true,
        maxlength: 100
    },
    upvote: {
        type: [String],
        default: []
    },
    downvote: {
        type: [String],
        default: []
    },
}, { timestamps: true });

const SoalSchema = new Schema<ISoal>({
    namasoal: {
        type: String,
        required: true,
        maxlength: 30
    },
    level: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    tags: {
        type: [String],
        required: true
    },
    soal: {
        type: String,
        required: true,
        maxlength: 2500
    },
    pembuat: {
        type: Schema.Types.ObjectId,
        ref: "akun",
        required: true,
    },
    public: {
        type: Boolean,
        default: false
    },
    favorit: [{
        type: Schema.Types.ObjectId,
        ref: "favorit"
    }],
    diskusi: [{
        type: Schema.Types.ObjectId,
        ref: "diskusi"     
    }],
    BahasaSoal: {
        type: [{
            bahasa: {
                type: String,
                required: true,
            },
            listjawaban: {
                type: String,
                required: true,
                maxlength: 1000,
            },
            contohjawaban: {
                type: String,
                required: true,
                maxlength: 1000,
            },
            liatankode: {
                type: String,
                required: true,
                maxlength: 300,
            },
            jawabankode: {
                type: String,
                required: true,
                maxlength: 1500,
            },
            _id: false
        }],
    },
    solusi: [{
        type: Schema.Types.ObjectId,
        ref: "solusi",
    }]
}, { timestamps: true });

const FavoritSchema = new Schema<IFavorit>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "akun",
        required: true
    },
    soal: {
        type: Schema.Types.ObjectId,
        ref: "soal",
        required: true
    },
});

const DataModel = {
    AkunModel: mongoose.models?.akun || mongoose.model("akun", UserSchema),
    SoalModel: mongoose.models?.soal || mongoose.model("soal", SoalSchema),
    SolusiModel: mongoose.models?.solusi || mongoose.model("solusi", SolusiSchema),
    FavoritModel: mongoose.models?.favorit || mongoose.model("favorit", FavoritSchema),
    DiskusiModel: mongoose.models?.diskusi || mongoose.model("diskusi", DiskusiSchema),
}

export { DataModel };