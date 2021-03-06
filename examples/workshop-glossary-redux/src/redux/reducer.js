import Actions from "./actions";

const DEFAULT_STATE = {
    chosenEntry: null,
    error: null,
    isFocused: false,
    glossary: [],
    glossaryLoading: false,
    glossaryUpdatingRemote: false,
    phraseValue: "",
    definitionValue: null,
    loggedIn: true,
    rootRecord: null,
};

export default function reducer(state = DEFAULT_STATE, action) {
    console.warn("-> reducer", action);
    if (!action) {
        throw new Error("Unexpected action.");
    }
    switch (action.type) {
        case Actions.GLOSSARY_LOADING:
            return {
                ...state,
                glossaryLoading: true,
            };
        case Actions.GLOSSARY_LOADED:
            return {
                ...state,
                ...action.payload,
                glossaryLoading: false,
                chosenEntry: action.payload.chosenEntry,
                definitionValue: action.payload.chosenEntry
                    ? action.payload.chosenEntry.definition
                    : undefined,
                phraseValue: action.payload.chosenEntry
                    ? action.payload.chosenEntry.phrase
                    : undefined,
            };
        case Actions.GLOSSARY_UPDATED:
            // TODO(elsigh): use a map and emit an array from it
            return {
                ...state,
                glossary: state.glossary.map(row => {
                    if (row.phrase === action.payload.phrase) {
                        row.definition = action.payload.definition;
                    }
                    return row;
                }),
            };
        case Actions.GLOSSARY_UPDATING_REMOTE:
            return {
                ...state,
                glossaryUpdatingRemote: true,
            };
        case Actions.GLOSSARY_UPDATED_REMOTE:
            return {
                ...state,
                glossaryUpdatingRemote: false,
            };
        case Actions.GLOSSARY_ADD_PHRASE:
            return {
                ...state,
                glossary: [action.payload, ...state.glossary],
            };
        case Actions.ERROR:
            return {
                ...state,
                glossaryLoading: false,
                glossaryUpdatingRemote: false,
                error: action.payload,
            };
        case Actions.SET_PHRASE_VALUE:
            return {
                ...state,
                phraseValue: action.payload,
            };
        case Actions.SET_DEFINITION_VALUE:
            return {
                ...state,
                definitionValue: action.payload,
            };
        case Actions.SET_CHOSEN_ENTRY:
            return {
                ...state,
                chosenEntry: action.payload,
                definitionValue: action.payload
                    ? action.payload.definition
                    : null,
                phraseValue: action.payload ? action.payload.phrase : null,
            };

        case Actions.SET_FOCUSED:
            return {
                ...state,
                isFocused: action.payload,
            };
        default:
            return { ...state };
    }
}

export const getInitialState = rootRecord => {
    const chosenEntryRecord = rootRecord.get("chosenEntry");
    const chosenEntry = chosenEntryRecord ? chosenEntryRecord.spread() : {};
    return {
        ...DEFAULT_STATE,
        chosenEntry,
        phraseValue: chosenEntry.phrase || null,
        definitionValue: chosenEntry.definition || null,
    };
};
