/*
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = function (RED) {
    const { RegisterNamespaceTransaction, Deadline, NetworkType } = require('nem2-sdk');
    function createSubNamespace(config) {
        RED.nodes.createNode(this, config);
        this.namespace = config.namespace;
        this.subNamespace = config.subNamespace;
        this.leaseTime = config.leaseTime;
        this.network = RED.nodes.getNode(config.network).network;
        const node = this;

        this.on('input', function (msg) {
            try {
                if (typeof msg.nem === "undefined") {
                    msg.nem = {};
                }
                //get all the variables 
                const namespace = node.namespace || msg.nem.namespace || undefined;
                const subNamespace = node.subNamespace || msg.nem.subNamespace || undefined;

                const createSubNamespaceTransaction = RegisterNamespaceTransaction.createSubNamespace(
                    Deadline.create(),
                    subNamespace,
                    namespace,
                    NetworkType[node.network]);
                msg.nem.transaction = createSubNamespaceTransaction;
                msg.nem.transactionType = "createSubNamespace";
                node.send(msg);

            } catch (error) {
                node.error(error);
            }
        });
    }
    RED.nodes.registerType("createSubNamespace", createSubNamespace);
};
