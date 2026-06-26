const mongoose = require('mongoose');
const i18nTextSchema = require('./i18nTextSchema');

const HIGHLIGHT_CODES = [
  'frame',
  'wheel',
  'use',
  'volume',
  'fit',
  'material',
  'capacity',
  'season',
  'weight',
  'terrain',
  'waterproof',
  'type',
  'length',
  'waist',
  'skill',
];

const productHighlightSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Highlight must have a code.'],
      trim: true,
      lowercase: true,
      maxlength: [
        32,
        'Highlight code must be no more than 32 characters long.',
      ],
      enum: {
        values: HIGHLIGHT_CODES,
        message: 'Highlight code `{VALUE}` is not supported.',
      },
    },
    valueI18n: i18nTextSchema({
      required: [true, 'Highlight must have a localized value.'],
      maxlength: [
        128,
        'Highlight value must be no more than 128 characters long.',
      ],
    }),
  },
  { _id: false },
);

module.exports = productHighlightSchema;
module.exports.HIGHLIGHT_CODES = HIGHLIGHT_CODES;
