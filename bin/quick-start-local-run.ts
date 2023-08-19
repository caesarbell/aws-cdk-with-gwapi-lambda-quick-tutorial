#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MyCdkStack } from '../lib/MyCdkStack';

const app = new cdk.App();
new MyCdkStack(app, 'QuickStartLocalRunStack');