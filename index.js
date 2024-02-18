import Pokedex from 'pokedex-promise-v2';
import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

const apiEndpoint = 'https://pokeapi.co/api/v2/';

const P = new Pokedex();

/**
 * The API token used for authentication.
 * @type {string}
 */
const token = '6850537406:AAGKkYkhBFHVCI8gH5NnFhBPS_jBI7pqY-Y';
const bot = new TelegramBot(token, { polling: true });

/**
 * Displays a keyboard with options for selecting a Pokémon generation.
 * 
 * @param {number} chatId - The ID of the chat where the keyboard will be displayed.
 * @returns {void}
 */
const showGenerationsKeyboard = (chatId) => {
    bot.sendMessage(chatId, 'Por favor, elige una generación:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Generación 1', callback_data: 'generation_1' }],
                [{ text: 'Generación 2', callback_data: 'generation_2' }],
                [{ text: 'Generación 3', callback_data: 'generation_3' }],
                [{ text: 'Generación 4', callback_data: 'generation_4' }],
                [{ text: 'Generación 5', callback_data: 'generation_5' }],
                [{ text: 'Generación 6', callback_data: 'generation_6' }],
                [{ text: 'Generación 7', callback_data: 'generation_7' }],
                [{ text: 'Generación 8', callback_data: 'generation_8' }],
                [{ text: 'Generación 9', callback_data: 'generation_9' }]
            ]
        }
    });
};

bot.onText(/\/start/, (msg) => {
    /**
     * The ID of the chat.
     * @type {number}
     */
    const chatId = msg.chat.id;
    showGenerationsKeyboard(chatId);
});


bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    /**
     * Represents the generation of a Pokémon.
     * @type {string}
     */
    const generation = callbackQuery.data.split('_')[1];

    try {
        /**
         * Represents the response object from the API call.
         * @typedef {Object} Response
         * @property {string} data - The response data.
         * @property {number} status - The HTTP status code of the response.
         * @property {string} statusText - The status text of the response.
         * @property {Object} headers - The headers of the response.
         * @property {string} config - The configuration used for the request.
         * @property {Object} request - The request object.
         */

        /**
         * Makes an API call to retrieve data for a specific generation.
         * @param {string} generation - The generation to retrieve data for.
         * @returns {Promise<Response>} The response object from the API call.
         */
        /**
         * Represents the response object from the API call.
         * @typedef {Object} Response
         * @property {any} data - The response data.
         * @property {number} status - The HTTP status code of the response.
         * @property {string} statusText - The status message of the response.
         * @property {Object} headers - The headers of the response.
         * @property {string} config - The request configuration.
         * @property {Object} request - The request object.
         */
        const response = await axios.get(`${apiEndpoint}/generation/${generation}`);
        const pokemonList = response.data.pokemon_species;

        /**
         * Represents a message for a specific Pokémon generation.
         * @type {string}
         */
        let message = `Pokémon de la Generación ${generation}:\n`;
        pokemonList.forEach(pokemon => {
            message += `- ${pokemon.name}\n`;
        });

        bot.sendMessage(chatId, message);
        showGenerationsKeyboard(chatId);
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        bot.sendMessage(chatId, 'Lo siento, ha ocurrido un error al obtener los datos. Por favor, inténtalo de nuevo más tarde.');
    }
});