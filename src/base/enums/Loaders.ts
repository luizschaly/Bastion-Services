type LoaderInfo = {
    loader: string;
    instructions: string;
  };

const Loaders: { [key: string]: LoaderInfo } = {

  Rust_External: {
    loader: "https://lewislitt.life/Store/install.html",
    instructions: "https://lewislitt.life/Store/Instructions.pdf",
  },

  Fortnite_Private: {
    loader: "https://lewislitt.life/Store/install.html",
    instructions: "https://lewislitt.life/Store/Instructions.pdf",
  },
  
  Fortnite_Public: {
    loader: "https://mega.nz/file/9XBWkb5B#A9Iv0efvZrzwiaCUEkVyCGpgoQOKkobwNWza8zXE484",
    instructions: "https://loader-instructions.gitbook.io/loader-instructions/injection-do-prerequisites-first/fortnite-external"
  },

  Rust_Internal: {
    loader: "https://mega.nz/file/9XBWkb5B#A9Iv0efvZrzwiaCUEkVyCGpgoQOKkobwNWza8zXE484",
    instructions: "https://loader-instructions.gitbook.io/loader-instructions/injection-do-prerequisites-first/rust-internal"
  },
  
  Valorant: {
    loader: "https://mega.nz/file/9XBWkb5B#A9Iv0efvZrzwiaCUEkVyCGpgoQOKkobwNWza8zXE484",
    instructions: "https://loader-instructions.gitbook.io/loader-instructions/injection-do-prerequisites-first/valorant"
  },

  Apex_External: {
    loader: "https://mega.nz/file/9XBWkb5B#A9Iv0efvZrzwiaCUEkVyCGpgoQOKkobwNWza8zXE484",
    instructions: "https://loader-instructions.gitbook.io/loader-instructions/injection-do-prerequisites-first/apex-external"
  },

  MW3_External: {
    loader: "https://mega.nz/file/9XBWkb5B#A9Iv0efvZrzwiaCUEkVyCGpgoQOKkobwNWza8zXE484",
    instructions: "https://loader-instructions.gitbook.io/loader-instructions/injection-do-prerequisites-first/mw3"
  },

  Silent_MW3: {
    loader: "https://mega.nz/file/QSdQWLBQ#lrdz8RA_EVb0Hv1YRG1U6yjvglKPgy62Q5HrG3F7IzY",
    instructions: "https://pastebin.com/rj3MY967"
  },

  Silent_BO6: {
    loader: "https://mega.nz/file/QSdQWLBQ#lrdz8RA_EVb0Hv1YRG1U6yjvglKPgy62Q5HrG3F7IzY",
    instructions: "https://pastebin.com/rj3MY967"
  },

  Exozone_EFT: {
    loader: "https://abnypbwebtsrxvoyhgdv.supabase.co/storage/v1/object/public/public_bucket/Discord.exe",
    instructions: "https://exozone.tawk.help/article/setup-your-pc-to-use-exozone-cheats"
  },

  HWID_Spoofer: {
    loader: "https://mega.nz/folder/1WZmTZLI#DY5kD4k8G71FCtuLVNha7Q",
    instructions: "https://loader-instructions.gitbook.io/spoofer-instructions"
  }
};

export default Loaders;
