/* Import modules. */
import _ from 'lodash'

/* Import (local) modules. */
import errors from '../errors/index.js'

export default {
    checkState: function(condition, message) {
        if (!condition) {
            throw new errors.InvalidState(message)
        }
    },
    checkArgument: function(condition, argumentName, message, docsPath) {
        if (!condition) {
            throw new errors.InvalidArgument(argumentName, message, docsPath)
        }
    },
    checkArgumentType: function(argument, type, argumentName) {
        argumentName = argumentName || '(unknown name)'

        if (_.isString(type)) {
            if (type === 'Buffer') {
                if (!Buffer.isBuffer(argument)) {
                    throw new errors.InvalidArgumentType(argument, type, argumentName)
                }
            } else if (typeof argument !== type) {
                throw new errors.InvalidArgumentType(argument, type, argumentName)
            }
        } else {
            if (!(argument instanceof type)) {
                throw new errors.InvalidArgumentType(argument, type.name, argumentName)
            }
        }
    }
}
