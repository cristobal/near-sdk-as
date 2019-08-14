import { runtime_api } from './runtime_api';
import { util } from "./util";
import { logging } from "./logging";

export namespace math {

     /**
     * Hash a given Uint8Array. Returns hash as 32-bit integer.
     */
    export function hash32Bytes(data: Uint8Array): u32 {
        runtime_api.sha256(data.buffer.byteLength, data.buffer as u64, 0);
        const registerContents = new Uint8Array((i32)(runtime_api.register_len(0)));
        runtime_api.read_register(0, registerContents.buffer as u64);
        return this._uint8ArrayToU32(registerContents);
    }

    /**
     * Hash given data. Returns hash as 32-bit integer.
     * @param data data can be passed as anything with .toString (hashed as UTF-8 string).
     */
    export function hash32<T>(data: T): u32 {
        const dataAsBytes = util.stringToBytes(data.toString());
        runtime_api.sha256(dataAsBytes.buffer.byteLength, dataAsBytes.buffer as u64, 0);
        const registerContents = new Uint8Array((i32)(runtime_api.register_len(0)));
        runtime_api.read_register(0, registerContents.buffer as u64);
        return this._uint8ArrayToU32(registerContents);    
    }

    function _uint8ArrayToU32(data: Uint8Array): u32 {
        assert(data.buffer != null && data.length >= 4, "Cannot convert input Uint8Array to u32");
        return (
            (0xff & data[0]) << 24  |
            (0xff & data[1]) << 16  |
            (0xff & data[2]) << 8   |
            (0xff & data[3]) << 0
        ); 
    }

    // function _uint8ArrayToI32(data: Uint8Array): u32 {
    //     assert(data != null && data.length >= 4, "Cannot convert input Uint8Array to u32");
    //     return (
    //         (0xff & data[0]) << 24  |
    //         (0xff & data[1]) << 16  |
    //         (0xff & data[2]) << 8   |
    //         (0xff & data[3]) << 0
    //     ); 
    // }

    // /**
    //  * Hash given data. Returns hash as 32-byte array.
    //  * @param data data can be passed as either Uint8Array or anything with .toString (hashed as UTF-8 string).
    //  */
    // export function hash<T>(data: T): Uint8Array {
    //     runtime_api.sha256(data.byteLength, data as u64, 0);
    //     const registerContents = new Uint8Array(runtime_api.register_len(0) as i32);
    //     runtime_api.read_register(0, registerContents.buffer as u64);
    //     logging.log(String.fromCharCode(registerContents[0]));
    //     return registerContents;
    // }

    // /**
    //  * Returns random byte buffer of given length.
    //  */
    // export function randomBuffer(len: u32): Uint8Array {
    //     // simple approach: random seed 
    //     let result = new Uint8Array(len);
    //     _near_random_buf(len, result.dataStart);
    //     return result;
    // }

    /**
     * Returns random 32-bit integer.
     */
    export function random32(): u32 {
        runtime_api.random_seed(0);
        const registerContents = new Uint8Array(runtime_api.register_len(0) as i32);
        runtime_api.read_register(0, registerContents.buffer as u64);
        return _uint8ArrayToU32(registerContents);//random32();
    }
}