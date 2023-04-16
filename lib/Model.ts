import mongoose, { model, Schema } from 'mongoose';
import { IAkun, IKomentar, ISoal, ISolusi } from '../types/tipe';

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
            soal: {
                type: {
                    namasoal: String,
                },
                required: true,
            },
            kapan: {
                type: Date,
                default: Date.now()
            },
            bahasa: {
                type: String,
                required: true,
            }
        }],
        required: true,
        default: []
    },
    favorit: {
        type: [{
            id: {
                type: String,
                required: true
            },
            namasoal: {
                type: String,
                required: true,
            }
        }],
        required: true,
        default: []
    },
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
        maxlength: 200
    },
    pembuat: {
        type: UserSchema,
        required: true,
    },
    public: {
        type: Boolean,
        default: false
    },
    favorit: {
        type: [String],
        default: [],
    },
    diskusi: {
        type: [{
            id: {
                type: String,
                required: true,
                unique: true
            },
            user: {
                type: UserSchema,
                required: true
            },
            text: {
                type: String,
                required: true,
                maxlength: 100
            },
            bikin: {
                type: Date,
                default: Date.now()
            },
            upvote: {
                type: [String],
                default: []
            },
            downvote: {
                type: [String],
                default: []
            },
        }]
    },
    BahasaSoal: {
        type: [{
            bahasa: {
                type: String,
                required: true,
            },
            listjawaban: {
                type: String,
                required: true,
                maxlength: 500,
            },
            contohjawaban: {
                type: String,
                required: true,
                maxlength: 500,
            },
            liatankode: {
                type: String,
                required: true,
                maxlength: 500,
            },
            jawabankode: {
                type: String,
                required: true,
                maxlength: 500,
            }
        }]
    },
    solusi: {
        type: [{
            id: {
                type: String,
                required: true,
            },
            idsoal: {
                type: String,
            }
        }]
    }
}, { timestamps: true });

const KomentarSchema = new Schema<IKomentar>({
    komen: {
        type: String,
        required: true
    },
    user: {
        type: UserSchema,
        required: true
    },
    upvote: {
        type: [String],
        default: []
    },
    downvote: {
        type: [String],
        default: []
    }
});

const SolusiSchema = new Schema<ISolusi>({
    idsoal: {
        type: String,
        required: true
    },
    user: {
        type: UserSchema
    },
    pintar: {
        type: [String],
        default: []
    },
    komentar: {
        type: [KomentarSchema],
        default: []
    },
    kode: {
        type: String,
        required: true
    },
    bahasa: {
        type: String,
        required: true
    }
}, { timestamps: true });

const DataModel = {
    AkunModel: mongoose.models.akun || mongoose.model("akun", UserSchema),
    SoalModel: mongoose.models.soal || mongoose.model("soal", SoalSchema),
}

export { DataModel };